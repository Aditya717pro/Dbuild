import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=\s]+)$/i;

const POSTER_COLUMNS = `
  p.id, p.title, p.company,
  DATE_FORMAT(p.drive_date, '%Y-%m-%d') AS drive_date,
  p.venue, p.eligibility,
  DATE_FORMAT(p.registration_deadline, '%Y-%m-%d') AS registration_deadline,
  p.description, p.apply_url, p.department_id, p.posted_by, p.created_at,
  d.name AS department_name, d.code AS department_code,
  u.name AS posted_by_name`;

const POSTER_JOINS = `
  FROM placement_posters p
  LEFT JOIN departments d ON d.id = p.department_id
  LEFT JOIN users u ON u.id = p.posted_by`;

function hasImageSignature(buffer, mime) {
  if (mime === 'image/jpeg') {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === 'image/png') {
    return (
      buffer.length > 8
      && buffer[0] === 0x89
      && buffer[1] === 0x50
      && buffer[2] === 0x4e
      && buffer[3] === 0x47
      && buffer[4] === 0x0d
      && buffer[5] === 0x0a
      && buffer[6] === 0x1a
      && buffer[7] === 0x0a
    );
  }
  if (mime === 'image/webp') {
    return (
      buffer.length > 12
      && buffer.toString('ascii', 0, 4) === 'RIFF'
      && buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }
  return false;
}

function parseImageData(imageData) {
  const match = DATA_URL_PATTERN.exec(imageData || '');
  if (!match) {
    throw httpError(400, 'Poster image must be a PNG, JPEG, or WebP file');
  }

  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');

  if (!buffer.length) {
    throw httpError(400, 'Poster image is empty');
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw httpError(400, 'Poster image must be smaller than 3 MB');
  }
  if (!hasImageSignature(buffer, mime)) {
    throw httpError(400, 'Poster image file is not a valid image');
  }

  return { buffer, mime };
}

function normalizePoster(row) {
  return {
    ...row,
    department_id: row.department_id ?? null,
    registration_deadline: row.registration_deadline || null,
    description: row.description || null,
    apply_url: row.apply_url || null,
    posted_by_name: row.posted_by_name || null,
  };
}

export async function publicList(req, res) {
  const { rows } = await query(
    `SELECT ${POSTER_COLUMNS}
     ${POSTER_JOINS}
     WHERE p.drive_date >= CURDATE()
     ORDER BY p.drive_date ASC, p.created_at DESC
     LIMIT 50`,
  );

  return res.json({ posters: rows.map(normalizePoster) });
}

export async function publicImage(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, 'Invalid poster id');
  }

  const { rows } = await query(
    'SELECT image_data, image_mime FROM placement_posters WHERE id = ?',
    [id],
  );
  const poster = rows[0];
  if (!poster) {
    throw httpError(404, 'Placement poster not found');
  }

  const image = Buffer.isBuffer(poster.image_data)
    ? poster.image_data
    : Buffer.from(poster.image_data);

  res.set({
    'Content-Type': poster.image_mime,
    'Content-Length': image.length,
    'Cache-Control': 'public, max-age=86400',
  });
  return res.send(image);
}

export async function list(req, res) {
  const { rows } = await query(
    `SELECT ${POSTER_COLUMNS}
     ${POSTER_JOINS}
     ORDER BY p.created_at DESC, p.drive_date ASC
     LIMIT 200`,
  );

  return res.json({ posters: rows.map(normalizePoster) });
}

export async function create(req, res) {
  const {
    title, company, drive_date: driveDate, venue, eligibility,
    registration_deadline: registrationDeadline, description, apply_url: applyUrl,
    department_id: departmentId, image_data: imageData,
  } = req.body;

  const today = new Date().toISOString().slice(0, 10);
  if (driveDate < today) {
    throw httpError(400, 'Drive date must be today or later');
  }
  if (registrationDeadline && registrationDeadline > driveDate) {
    throw httpError(400, 'Registration deadline cannot be after the drive date');
  }

  const normalizedUrl = applyUrl || null;
  if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
    throw httpError(400, 'Apply link must start with http:// or https://');
  }

  const { buffer, mime } = parseImageData(imageData);

  const { insertId } = await query(
    `INSERT INTO placement_posters
       (title, company, drive_date, venue, eligibility, registration_deadline,
        description, apply_url, department_id, image_data, image_mime, posted_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      company,
      driveDate,
      venue,
      eligibility,
      registrationDeadline || null,
      description || null,
      normalizedUrl,
      departmentId ?? null,
      buffer,
      mime,
      req.user.id,
    ],
  );

  const { rows } = await query(
    `SELECT ${POSTER_COLUMNS}
     ${POSTER_JOINS}
     WHERE p.id = ?`,
    [insertId],
  );

  await writeAudit(null, req.user.id, 'placement_poster.create', 'placement_posters', insertId);
  return res.status(201).json({ poster: normalizePoster(rows[0]) });
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, 'Invalid poster id');
  }

  const { rows } = await query(
    'SELECT id, posted_by FROM placement_posters WHERE id = ?',
    [id],
  );
  const poster = rows[0];
  if (!poster) {
    throw httpError(404, 'Placement poster not found');
  }

  if (req.user.role !== 'admin' && poster.posted_by !== req.user.id) {
    throw httpError(403, 'You can only remove posters that you posted');
  }

  await query('DELETE FROM placement_posters WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'placement_poster.delete', 'placement_posters', id);
  return res.json({ message: 'Placement poster deleted' });
}
