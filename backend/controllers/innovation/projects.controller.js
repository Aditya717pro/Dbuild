import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  addFeedback,
  assertHttpUrl,
  insertMedia,
  isAdmin,
  isStaff,
  listFeedback,
  notify,
  parsePositiveId,
} from './common.js';

const PROJECT_SELECT = `
  SELECT p.id, p.idea_id, p.title, p.description, p.problem_solved, p.technology,
         p.team_members, p.department_id, p.owner_id, p.mentor_id, p.github_url,
         p.demo_url, p.status, p.progress, p.is_featured, p.created_at, p.updated_at,
         d.name AS department_name, d.code AS department_code,
         owner.name AS owner_name, owner.email AS owner_email,
         mentor.name AS mentor_name, mentor.email AS mentor_email,
         (SELECT COUNT(*) FROM innovation_project_media m
          WHERE m.project_id = p.id AND m.kind = 'image') AS image_count,
         (SELECT COUNT(*) FROM innovation_feedback f
          WHERE f.entity_type = 'project' AND f.entity_id = p.id) AS feedback_count
  FROM innovation_projects p
  JOIN users owner ON owner.id = p.owner_id
  LEFT JOIN departments d ON d.id = p.department_id
  LEFT JOIN users mentor ON mentor.id = p.mentor_id`;

async function fetchProject(id, client = null) {
  const runner = client ?? { query };
  const { rows } = await runner.query(`${PROJECT_SELECT} WHERE p.id = ?`, [id]);
  return rows[0] || null;
}

function canEditProject(user, project) {
  if (isAdmin(user)) return true;
  if (project.owner_id === user.id) return true;
  return user.role === 'faculty' && project.mentor_id === user.id;
}

export async function listProjects(req, res) {
  const { rows } = await query(`${PROJECT_SELECT} ORDER BY p.is_featured DESC, p.updated_at DESC LIMIT 300`);
  return res.json({ projects: rows });
}

export async function getProject(req, res) {
  const id = parsePositiveId(req.params.id, 'project id');
  const project = await fetchProject(id);
  if (!project) throw httpError(404, 'Project not found');

  const [media, feedback] = await Promise.all([
    query(
      `SELECT id, kind, file_name, mime, size_bytes, created_at
       FROM innovation_project_media
       WHERE project_id = ?
       ORDER BY created_at ASC`,
      [id],
    ),
    listFeedback('project', id),
  ]);

  return res.json({ project, media: media.rows, feedback });
}

export async function createProject(req, res) {
  const {
    idea_id: ideaId, title, description, problem_solved: problemSolved,
    technology, team_members: teamMembers, department_id: departmentId,
    mentor_id: mentorId, github_url: githubUrl, demo_url: demoUrl,
    status = 'planning', progress = 0, is_featured: isFeatured = false,
    images = [], document = null,
  } = req.body;

  let idea = null;
  if (ideaId) {
    const result = await query(
      `SELECT id, title, submitted_by, department_id, mentor_id, status
       FROM innovation_ideas WHERE id = ?`,
      [ideaId],
    );
    idea = result.rows[0];
    if (!idea) throw httpError(400, 'Selected idea does not exist');
    if (!isStaff(req.user) && idea.submitted_by !== req.user.id) {
      throw httpError(403, 'You can only create a project from your own idea');
    }
    if (!isStaff(req.user) && !['approved', 'prototype_development', 'completed'].includes(idea.status)) {
      throw httpError(400, 'The idea must be approved before a project can be created');
    }
  } else if (!isStaff(req.user)) {
    throw httpError(400, 'Select an approved idea before creating a project');
  }

  const ownerId = idea ? idea.submitted_by : req.user.id;
  const finalMentorId = isStaff(req.user) ? (mentorId ?? idea?.mentor_id ?? null) : (idea?.mentor_id ?? null);
  const finalDepartmentId = departmentId ?? idea?.department_id ?? null;
  const finalFeatured = isAdmin(req.user) ? Boolean(isFeatured) : false;
  const github = assertHttpUrl(githubUrl, 'GitHub URL');
  const demo = assertHttpUrl(demoUrl, 'Demo URL');

  const project = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_projects
         (idea_id, title, description, problem_solved, technology, team_members,
          department_id, owner_id, mentor_id, github_url, demo_url, status,
          progress, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ideaId ?? null,
        title,
        description,
        problemSolved || null,
        technology || null,
        teamMembers || null,
        finalDepartmentId,
        ownerId,
        finalMentorId,
        github,
        demo,
        status,
        progress,
        finalFeatured ? 1 : 0,
      ],
    );

    await insertMedia(client, 'innovation_project_media', 'project_id', insertId, images, document);

    if (ideaId) {
      await client.query(
        "UPDATE innovation_ideas SET status = 'prototype_development' WHERE id = ? AND status = 'approved'",
        [ideaId],
      );
    }

    if (ownerId !== req.user.id) {
      await notify(client, ownerId, {
        title: 'Project showcase entry created',
        message: `"${title}" has been added to the project showcase.`,
        type: 'idea',
        link: '/innovation/portal/projects',
      });
    }

    if (finalMentorId && finalMentorId !== req.user.id) {
      await notify(client, finalMentorId, {
        title: 'New project assigned',
        message: `You are now mentoring the project "${title}".`,
        type: 'mentor',
        link: '/innovation/portal/projects',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_project.create', 'innovation_projects', insertId);
    return fetchProject(insertId, client);
  });

  return res.status(201).json({ project });
}

export async function updateProject(req, res) {
  const id = parsePositiveId(req.params.id, 'project id');
  const existing = await query(
    'SELECT id, owner_id, mentor_id, is_featured FROM innovation_projects WHERE id = ?',
    [id],
  );
  const project = existing.rows[0];
  if (!project) throw httpError(404, 'Project not found');
  if (!canEditProject(req.user, project)) {
    throw httpError(403, 'You cannot edit this project');
  }

  const {
    title, description, problem_solved: problemSolved, technology,
    team_members: teamMembers, department_id: departmentId,
    mentor_id: mentorId, github_url: githubUrl, demo_url: demoUrl,
    status, progress, is_featured: isFeatured,
  } = req.body;

  const finalMentorId = isStaff(req.user) ? (mentorId ?? project.mentor_id ?? null) : project.mentor_id;
  const github = assertHttpUrl(githubUrl, 'GitHub URL');
  const demo = assertHttpUrl(demoUrl, 'Demo URL');

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_projects
       SET title = ?, description = ?, problem_solved = ?, technology = ?,
           team_members = ?, department_id = ?, mentor_id = ?, github_url = ?,
           demo_url = ?, status = ?, progress = ?, is_featured = ?
       WHERE id = ?`,
      [
        title,
        description,
        problemSolved || null,
        technology || null,
        teamMembers || null,
        departmentId ?? null,
        finalMentorId,
        github,
        demo,
        status,
        progress,
        isAdmin(req.user) && isFeatured !== undefined ? (isFeatured ? 1 : 0) : project.is_featured,
        id,
      ],
    );

    if (finalMentorId && finalMentorId !== project.mentor_id) {
      await notify(client, finalMentorId, {
        title: 'New project assigned',
        message: `You are now mentoring the project "${title}".`,
        type: 'mentor',
        link: '/innovation/portal/projects',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_project.update', 'innovation_projects', id);
  });

  return res.json({ project: await fetchProject(id) });
}

export async function deleteProject(req, res) {
  const id = parsePositiveId(req.params.id, 'project id');
  const { rows } = await query(
    'SELECT id, title, owner_id FROM innovation_projects WHERE id = ?',
    [id],
  );
  const project = rows[0];
  if (!project) throw httpError(404, 'Project not found');
  if (!isAdmin(req.user) && project.owner_id !== req.user.id) {
    throw httpError(403, 'You can only delete your own project');
  }

  await query('DELETE FROM innovation_projects WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'innovation_project.delete', 'innovation_projects', id);
  return res.json({ message: 'Project deleted' });
}

export async function projectFeedback(req, res) {
  const id = parsePositiveId(req.params.id, 'project id');
  const { rows } = await query(
    'SELECT id, title, owner_id FROM innovation_projects WHERE id = ?',
    [id],
  );
  const project = rows[0];
  if (!project) throw httpError(404, 'Project not found');
  if (!isStaff(req.user)) throw httpError(403, 'Only faculty and administrators can provide feedback');

  return addFeedback(
    req,
    res,
    'project',
    id,
    project.owner_id,
    {
      title: 'New feedback on your project',
      message: `${req.user.name} commented on "${project.title}".`,
      type: 'idea',
      link: '/innovation/portal/projects',
    },
  );
}

export async function addProjectMedia(req, res) {
  const id = parsePositiveId(req.params.id, 'project id');
  const { rows } = await query(
    'SELECT id, title, owner_id, mentor_id FROM innovation_projects WHERE id = ?',
    [id],
  );
  const project = rows[0];
  if (!project) throw httpError(404, 'Project not found');
  if (!canEditProject(req.user, project)) {
    throw httpError(403, 'You cannot add images to this project');
  }

  const { images = [] } = req.body;
  if (!images.length) throw httpError(400, 'Select at least one image');

  await withTransaction(async (client) => {
    await insertMedia(client, 'innovation_project_media', 'project_id', id, images, null);
    await writeAudit(client, req.user.id, 'innovation_project.media_add', 'innovation_projects', id);
  });

  const media = await query(
    `SELECT id, kind, file_name, mime, size_bytes, created_at
     FROM innovation_project_media
     WHERE project_id = ?
     ORDER BY created_at ASC`,
    [id],
  );
  return res.status(201).json({ media: media.rows });
}
