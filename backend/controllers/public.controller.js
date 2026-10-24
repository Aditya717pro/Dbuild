import { query } from '../db/pool.js';

export async function publicAnnouncements(req, res) {
  const { rows } = await query(
    `SELECT id, title, body, created_at
     FROM announcements
     WHERE audience = 'all'
     ORDER BY created_at DESC
     LIMIT 10`,
  );
  return res.json({ announcements: rows });
}
