import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  addFeedback,
  insertMedia,
  isAdmin,
  isStaff,
  listFeedback,
  notify,
  notifyAdmins,
  parsePositiveId,
} from './common.js';

const IDEA_SELECT = `
  SELECT i.id, i.title, i.category, i.problem_statement, i.proposed_solution,
         i.technology, i.team_members, i.department_id, i.year_of_study,
         i.expected_outcome, i.status, i.mentor_id, i.submitted_by,
         i.review_note, i.submitted_at, i.reviewed_at, i.created_at, i.updated_at,
         d.name AS department_name, d.code AS department_code,
         owner.name AS owner_name, owner.email AS owner_email,
         mentor.name AS mentor_name, mentor.email AS mentor_email,
         (SELECT COUNT(*) FROM innovation_idea_attachments a WHERE a.idea_id = i.id) AS attachment_count,
         (SELECT COUNT(*) FROM innovation_feedback f
          WHERE f.entity_type = 'idea' AND f.entity_id = i.id) AS feedback_count
  FROM innovation_ideas i
  JOIN users owner ON owner.id = i.submitted_by
  LEFT JOIN departments d ON d.id = i.department_id
  LEFT JOIN users mentor ON mentor.id = i.mentor_id`;

async function fetchIdea(id, client = null) {
  const runner = client ?? { query };
  const { rows } = await runner.query(`${IDEA_SELECT} WHERE i.id = ?`, [id]);
  return rows[0] || null;
}

async function assertIdeaAccess(user, idea) {
  if (!idea) throw httpError(404, 'Idea not found');
  if (user.role === 'student' && idea.submitted_by !== user.id) {
    throw httpError(403, 'You can only access your own ideas');
  }
}

export async function listIdeas(req, res) {
  const { user } = req;
  let where = '';
  let params = [];

  if (user.role === 'student') {
    where = 'WHERE i.submitted_by = ?';
    params = [user.id];
  } else if (user.role === 'faculty' && req.query.assigned === 'true') {
    where = 'WHERE i.mentor_id = ?';
    params = [user.id];
  }

  const { rows } = await query(
    `${IDEA_SELECT}
     ${where}
     ORDER BY FIELD(i.status, 'submitted', 'under_review', 'draft', 'approved', 'prototype_development', 'rejected', 'completed'),
              i.updated_at DESC
     LIMIT 300`,
    params,
  );
  return res.json({ ideas: rows });
}

export async function getIdea(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const idea = await fetchIdea(id);
  await assertIdeaAccess(req.user, idea);

  const [media, feedback] = await Promise.all([
    query(
      `SELECT id, kind, file_name, mime, size_bytes, created_at
       FROM innovation_idea_attachments
       WHERE idea_id = ?
       ORDER BY kind DESC, created_at ASC`,
      [id],
    ),
    listFeedback('idea', id),
  ]);

  return res.json({ idea, media: media.rows, feedback });
}

export async function createIdea(req, res) {
  const {
    title, category, problem_statement: problemStatement,
    proposed_solution: proposedSolution, technology, team_members: teamMembers,
    department_id: departmentId, year_of_study: yearOfStudy,
    expected_outcome: expectedOutcome, status = 'draft',
    images = [], document = null,
  } = req.body;

  const finalStatus = status === 'submitted' ? 'submitted' : 'draft';

  const idea = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_ideas
         (title, category, problem_statement, proposed_solution, technology, team_members,
          department_id, year_of_study, expected_outcome, status, submitted_by, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category,
        problemStatement,
        proposedSolution,
        technology || null,
        teamMembers || null,
        departmentId ?? null,
        yearOfStudy || null,
        expectedOutcome || null,
        finalStatus,
        req.user.id,
        finalStatus === 'submitted' ? new Date() : null,
      ],
    );

    await insertMedia(client, 'innovation_idea_attachments', 'idea_id', insertId, images, document);

    if (finalStatus === 'submitted') {
      await notifyAdmins(client, {
        title: 'New innovation idea submitted',
        message: `${req.user.name} submitted "${title}" for review.`,
        type: 'idea',
        link: '/innovation/portal/admin',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_idea.create', 'innovation_ideas', insertId);
    return fetchIdea(insertId, client);
  });

  return res.status(201).json({ idea });
}

export async function updateIdea(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const existing = await query(
    'SELECT id, submitted_by, status, title FROM innovation_ideas WHERE id = ?',
    [id],
  );
  const idea = existing.rows[0];
  await assertIdeaAccess(req.user, idea);

  if (!isAdmin(req.user) && !['draft', 'rejected'].includes(idea.status)) {
    throw httpError(400, 'Only drafts or rejected ideas can be edited');
  }

  const {
    title, category, problem_statement: problemStatement,
    proposed_solution: proposedSolution, technology, team_members: teamMembers,
    department_id: departmentId, year_of_study: yearOfStudy,
    expected_outcome: expectedOutcome, status,
  } = req.body;

  let finalStatus = idea.status;
  if (!isAdmin(req.user) && status) {
    finalStatus = status === 'submitted' ? 'submitted' : 'draft';
  }

  const updated = await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_ideas
       SET title = ?, category = ?, problem_statement = ?, proposed_solution = ?,
           technology = ?, team_members = ?, department_id = ?, year_of_study = ?,
           expected_outcome = ?, status = ?,
           submitted_at = CASE WHEN ? = 'submitted' AND submitted_at IS NULL THEN CURRENT_TIMESTAMP ELSE submitted_at END
       WHERE id = ?`,
      [
        title,
        category,
        problemStatement,
        proposedSolution,
        technology || null,
        teamMembers || null,
        departmentId ?? null,
        yearOfStudy || null,
        expectedOutcome || null,
        finalStatus,
        finalStatus,
        id,
      ],
    );

    if (finalStatus === 'submitted' && idea.status !== 'submitted') {
      await notifyAdmins(client, {
        title: 'Innovation idea resubmitted',
        message: `${req.user.name} submitted "${title}" for review.`,
        type: 'idea',
        link: '/innovation/portal/admin',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_idea.update', 'innovation_ideas', id);
    return fetchIdea(id, client);
  });

  return res.json({ idea: updated });
}

export async function submitIdea(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const { rows } = await query(
    'SELECT id, title, submitted_by, status FROM innovation_ideas WHERE id = ?',
    [id],
  );
  const idea = rows[0];
  await assertIdeaAccess(req.user, idea);

  if (!['draft', 'rejected'].includes(idea.status)) {
    throw httpError(400, 'Only drafts or rejected ideas can be submitted');
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_ideas
       SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, review_note = NULL
       WHERE id = ?`,
      [id],
    );
    await notifyAdmins(client, {
      title: 'New innovation idea submitted',
      message: `${req.user.name} submitted "${idea.title}" for review.`,
      type: 'idea',
      link: '/innovation/portal/admin',
    });
    await writeAudit(client, req.user.id, 'innovation_idea.submit', 'innovation_ideas', id);
  });

  return res.json({ idea: await fetchIdea(id) });
}

export async function reviewIdea(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const { status, review_note: reviewNote, mentor_id: mentorId } = req.body;

  const { rows } = await query(
    'SELECT id, title, submitted_by, mentor_id FROM innovation_ideas WHERE id = ?',
    [id],
  );
  const idea = rows[0];
  if (!idea) throw httpError(404, 'Idea not found');

  if (mentorId) {
    const mentor = await query(
      "SELECT u.id FROM users u JOIN innovation_mentor_profiles mp ON mp.user_id = u.id WHERE u.id = ? AND u.is_active = 1",
      [mentorId],
    );
    if (!mentor.rows[0]) throw httpError(400, 'Selected mentor is not available');
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_ideas
       SET status = ?, review_note = ?, mentor_id = COALESCE(?, mentor_id),
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, reviewNote || null, mentorId ?? null, id],
    );

    const notificationTitle = status === 'approved'
      ? 'Innovation idea approved'
      : status === 'rejected'
        ? 'Innovation idea needs changes'
        : 'Innovation idea status updated';

    await notify(client, idea.submitted_by, {
      title: notificationTitle,
      message: reviewNote || `Your idea "${idea.title}" is now ${status.replaceAll('_', ' ')}.`,
      type: 'idea',
      link: '/innovation/portal/ideas',
    });

    if (mentorId && mentorId !== idea.mentor_id) {
      await notify(client, mentorId, {
        title: 'New idea assigned for mentoring',
        message: `"${idea.title}" has been assigned to you as a mentor.`,
        type: 'mentor',
        link: '/innovation/portal/mentors',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_idea.review', 'innovation_ideas', id);
  });

  return res.json({ idea: await fetchIdea(id) });
}

export async function deleteIdea(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const { rows } = await query(
    'SELECT id, title, submitted_by, status FROM innovation_ideas WHERE id = ?',
    [id],
  );
  const idea = rows[0];
  await assertIdeaAccess(req.user, idea);

  if (!isAdmin(req.user) && !['draft', 'rejected'].includes(idea.status)) {
    throw httpError(400, 'Only drafts or rejected ideas can be deleted');
  }

  await query('DELETE FROM innovation_ideas WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'innovation_idea.delete', 'innovation_ideas', id);
  return res.json({ message: 'Idea deleted' });
}

export async function ideaFeedback(req, res) {
  const id = parsePositiveId(req.params.id, 'idea id');
  const { rows } = await query(
    'SELECT id, title, submitted_by FROM innovation_ideas WHERE id = ?',
    [id],
  );
  const idea = rows[0];
  if (!idea) throw httpError(404, 'Idea not found');
  if (!isStaff(req.user)) throw httpError(403, 'Only faculty and administrators can provide feedback');

  return addFeedback(
    req,
    res,
    'idea',
    id,
    idea.submitted_by,
    {
      title: 'New feedback on your idea',
      message: `${req.user.name} commented on "${idea.title}".`,
      type: 'idea',
      link: '/innovation/portal/ideas',
    },
  );
}

export async function deleteIdeaMedia(req, res) {
  const ideaId = parsePositiveId(req.params.id, 'idea id');
  const mediaId = parsePositiveId(req.params.mediaId, 'media id');

  const { rows } = await query(
    `SELECT i.submitted_by
     FROM innovation_ideas i
     JOIN innovation_idea_attachments a ON a.idea_id = i.id
     WHERE i.id = ? AND a.id = ?`,
    [ideaId, mediaId],
  );
  if (!rows[0]) throw httpError(404, 'Attachment not found');
  if (!isAdmin(req.user) && rows[0].submitted_by !== req.user.id) {
    throw httpError(403, 'You can only remove your own attachments');
  }

  await query('DELETE FROM innovation_idea_attachments WHERE id = ? AND idea_id = ?', [mediaId, ideaId]);
  return res.json({ message: 'Attachment removed' });
}
