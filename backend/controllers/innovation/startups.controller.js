import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  assertHttpUrl,
  isAdmin,
  notify,
  parsePositiveId,
} from './common.js';

const STARTUP_SELECT = `
  SELECT s.id, s.name, s.tagline, s.founder_id, s.description, s.problem, s.solution,
         s.market_opportunity, s.business_model, s.team_members, s.funding_required,
         s.stage, s.application_status, s.mentor_id, s.website_url, s.review_note,
         s.reviewed_by, s.submitted_at, s.reviewed_at, s.created_at, s.updated_at,
         founder.name AS founder_name, founder.email AS founder_email,
         mentor.name AS mentor_name, mentor.email AS mentor_email
  FROM innovation_startups s
  JOIN users founder ON founder.id = s.founder_id
  LEFT JOIN users mentor ON mentor.id = s.mentor_id`;

async function fetchStartup(id, client = null) {
  const runner = client ?? { query };
  const { rows } = await runner.query(`${STARTUP_SELECT} WHERE s.id = ?`, [id]);
  return rows[0] || null;
}

export async function listStartups(req, res) {
  let where = '';
  let params = [];
  if (req.user.role === 'student') {
    where = "WHERE s.founder_id = ? OR s.application_status = 'approved'";
    params = [req.user.id];
  }

  const { rows } = await query(
    `${STARTUP_SELECT}
     ${where}
     ORDER BY FIELD(s.application_status, 'submitted', 'under_review', 'approved', 'draft', 'rejected'),
              s.updated_at DESC
     LIMIT 300`,
    params,
  );
  return res.json({ startups: rows });
}

export async function getStartup(req, res) {
  const id = parsePositiveId(req.params.id, 'startup id');
  const startup = await fetchStartup(id);
  if (!startup) throw httpError(404, 'Startup not found');
  if (req.user.role === 'student'
    && startup.founder_id !== req.user.id
    && startup.application_status !== 'approved') {
    throw httpError(403, 'This startup application is not public');
  }
  return res.json({ startup });
}

export async function createStartup(req, res) {
  const {
    name, tagline, description, problem, solution, market_opportunity: marketOpportunity,
    business_model: businessModel, team_members: teamMembers, funding_required: fundingRequired,
    stage = 'idea_generation', application_status: applicationStatus = 'draft',
    website_url: websiteUrl,
  } = req.body;

  const website = assertHttpUrl(websiteUrl, 'Website URL');
  const status = applicationStatus === 'submitted' ? 'submitted' : 'draft';

  const startup = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_startups
         (name, tagline, founder_id, description, problem, solution, market_opportunity,
          business_model, team_members, funding_required, stage, application_status,
          website_url, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        tagline || null,
        req.user.id,
        description,
        problem || null,
        solution || null,
        marketOpportunity || null,
        businessModel || null,
        teamMembers || null,
        fundingRequired ?? null,
        stage,
        status,
        website,
        status === 'submitted' ? new Date() : null,
      ],
    );

    if (status === 'submitted') {
      const admins = await client.query("SELECT id FROM users WHERE role = 'admin' AND is_active = 1");
      for (const admin of admins.rows) {
        await notify(client, admin.id, {
          title: 'New Startup TN application',
          message: `${req.user.name} applied for pre-incubation with "${name}".`,
          type: 'startup',
          link: '/innovation/portal/admin',
        });
      }
    }

    await writeAudit(client, req.user.id, 'innovation_startup.create', 'innovation_startups', insertId);
    return fetchStartup(insertId, client);
  });

  return res.status(201).json({ startup });
}

export async function updateStartup(req, res) {
  const id = parsePositiveId(req.params.id, 'startup id');
  const existing = await query(
    'SELECT id, name, founder_id, application_status, stage FROM innovation_startups WHERE id = ?',
    [id],
  );
  const startup = existing.rows[0];
  if (!startup) throw httpError(404, 'Startup not found');
  if (!isAdmin(req.user) && startup.founder_id !== req.user.id) {
    throw httpError(403, 'You can only edit your own startup');
  }

  const {
    name, tagline, description, problem, solution, market_opportunity: marketOpportunity,
    business_model: businessModel, team_members: teamMembers, funding_required: fundingRequired,
    stage, application_status: applicationStatus, website_url: websiteUrl,
  } = req.body;

  const website = assertHttpUrl(websiteUrl, 'Website URL');
  let finalStatus = startup.application_status;
  if (isAdmin(req.user) && applicationStatus) finalStatus = applicationStatus;
  if (!isAdmin(req.user) && ['draft', 'rejected'].includes(startup.application_status) && applicationStatus) {
    finalStatus = applicationStatus === 'submitted' ? 'submitted' : 'draft';
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_startups
       SET name = ?, tagline = ?, description = ?, problem = ?, solution = ?,
           market_opportunity = ?, business_model = ?, team_members = ?,
           funding_required = ?, stage = ?, application_status = ?, website_url = ?,
           submitted_at = CASE WHEN ? = 'submitted' AND submitted_at IS NULL
                               THEN CURRENT_TIMESTAMP ELSE submitted_at END
       WHERE id = ?`,
      [
        name,
        tagline || null,
        description,
        problem || null,
        solution || null,
        marketOpportunity || null,
        businessModel || null,
        teamMembers || null,
        fundingRequired ?? null,
        stage,
        finalStatus,
        website,
        finalStatus,
        id,
      ],
    );

    if (finalStatus === 'submitted' && startup.application_status !== 'submitted') {
      const admins = await client.query("SELECT id FROM users WHERE role = 'admin' AND is_active = 1");
      for (const admin of admins.rows) {
        await notify(client, admin.id, {
          title: 'Startup application submitted',
          message: `${req.user.name} submitted "${name}" for pre-incubation review.`,
          type: 'startup',
          link: '/innovation/portal/admin',
        });
      }
    }

    await writeAudit(client, req.user.id, 'innovation_startup.update', 'innovation_startups', id);
  });

  return res.json({ startup: await fetchStartup(id) });
}

export async function reviewStartup(req, res) {
  const id = parsePositiveId(req.params.id, 'startup id');
  const {
    application_status: applicationStatus, review_note: reviewNote,
    stage, mentor_id: mentorId,
  } = req.body;

  const { rows } = await query(
    'SELECT id, name, founder_id, mentor_id FROM innovation_startups WHERE id = ?',
    [id],
  );
  const startup = rows[0];
  if (!startup) throw httpError(404, 'Startup not found');

  if (mentorId) {
    const mentor = await query(
      `SELECT mp.user_id FROM innovation_mentor_profiles mp
       JOIN users u ON u.id = mp.user_id
       WHERE mp.user_id = ? AND u.is_active = 1`,
      [mentorId],
    );
    if (!mentor.rows[0]) throw httpError(400, 'Selected mentor is not available');
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_startups
       SET application_status = ?, review_note = ?, stage = COALESCE(?, stage),
           mentor_id = COALESCE(?, mentor_id), reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [applicationStatus, reviewNote || null, stage ?? null, mentorId ?? null, req.user.id, id],
    );

    await notify(client, startup.founder_id, {
      title: applicationStatus === 'approved' ? 'Startup application approved' : 'Startup application updated',
      message: reviewNote || `"${startup.name}" is now ${applicationStatus.replaceAll('_', ' ')}.`,
      type: 'startup',
      link: '/innovation/portal/startups',
    });

    if (mentorId && mentorId !== startup.mentor_id) {
      await notify(client, mentorId, {
        title: 'New startup assigned',
        message: `You are now mentoring "${startup.name}".`,
        type: 'mentor',
        link: '/innovation/portal/startups',
      });
    }

    await writeAudit(client, req.user.id, 'innovation_startup.review', 'innovation_startups', id);
  });

  return res.json({ startup: await fetchStartup(id) });
}

export async function deleteStartup(req, res) {
  const id = parsePositiveId(req.params.id, 'startup id');
  const { rows } = await query(
    'SELECT id, founder_id, application_status FROM innovation_startups WHERE id = ?',
    [id],
  );
  const startup = rows[0];
  if (!startup) throw httpError(404, 'Startup not found');
  if (!isAdmin(req.user) && startup.founder_id !== req.user.id) {
    throw httpError(403, 'You can only delete your own startup');
  }
  if (!isAdmin(req.user) && !['draft', 'rejected'].includes(startup.application_status)) {
    throw httpError(400, 'Only draft or rejected startup applications can be deleted');
  }

  await query('DELETE FROM innovation_startups WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'innovation_startup.delete', 'innovation_startups', id);
  return res.json({ message: 'Startup application deleted' });
}
