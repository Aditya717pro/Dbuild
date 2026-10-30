import { query } from '../db/pool.js';
import { writeAudit } from '../utils/audit.js';
import { httpError } from '../utils/httpError.js';

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=\s]+)$/i;

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
    throw httpError(400, 'Announcement image must be a PNG, JPEG, or WebP file');
  }

  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');

  if (!buffer.length) {
    throw httpError(400, 'Announcement image is empty');
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw httpError(400, 'Announcement image must be smaller than 3 MB');
  }
  if (!hasImageSignature(buffer, mime)) {
    throw httpError(400, 'Announcement image file is not a valid image');
  }

  return { buffer, mime };
}

const SELECT_SQL = `
  SELECT a.id, a.title, a.body, a.audience, a.department_id, a.course_id,
         a.posted_by, a.created_at,
         (a.image_mime IS NOT NULL) AS has_image,
         u.name AS posted_by_name,
         COALESCE(d.name, fd.name) AS department_name,
         c.code AS course_code, c.name AS course_name
  FROM announcements a
  LEFT JOIN users u ON u.id = a.posted_by
  LEFT JOIN departments d ON d.id = a.department_id
  LEFT JOIN faculty f ON f.user_id = a.posted_by
  LEFT JOIN departments fd ON fd.id = f.department_id
  LEFT JOIN courses c ON c.id = a.course_id`;

const ANNOUNCEMENT_COLUMNS = `
  id, title, body, audience, department_id, course_id, posted_by, created_at,
  (image_mime IS NOT NULL) AS has_image`;

export async function list(req, res) {
  let rows;

  if (req.user.role === 'faculty' && !req.user.is_cdc) {
    throw httpError(403, 'Announcements are available only to CDC staff');
  }

  if (req.user.role === 'admin') {
    ({ rows } = await query(`${SELECT_SQL} ORDER BY a.created_at DESC LIMIT 200`));
  } else if (req.user.role === 'faculty') {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE a.audience = 'all'
          OR (a.audience = 'department'
              AND a.department_id = (SELECT department_id FROM faculty WHERE user_id = ?))
          OR (a.audience = 'course'
              AND a.course_id IN (SELECT id FROM courses WHERE faculty_id = ?))
          OR a.posted_by = ?
       ORDER BY a.created_at DESC
       LIMIT 200`,
      [req.user.id, req.user.id, req.user.id],
    ));
  } else {
    ({ rows } = await query(
      `${SELECT_SQL}
       WHERE a.audience = 'all'
          OR (a.audience = 'department'
              AND a.department_id = (SELECT department_id FROM students WHERE user_id = ?))
          OR (a.audience = 'course'
              AND a.course_id IN (SELECT course_id FROM enrollments WHERE student_id = ?))
       ORDER BY a.created_at DESC
       LIMIT 200`,
      [req.user.id, req.user.id],
    ));
  }

  return res.json({ announcements: rows });
}

export async function create(req, res) {
  const {
    title, body, audience = 'all',
    department_id: departmentId, course_id: courseId,
    image_data: imageData,
  } = req.body;

  if (req.user.role === 'faculty' && !req.user.is_cdc) {
    if (audience === 'all') {
      throw httpError(403, 'Faculty can only post to their department or their courses');
    }
    if (audience === 'department') {
      const { rows } = await query('SELECT department_id FROM faculty WHERE user_id = ?', [req.user.id]);
      if (!rows[0]?.department_id || rows[0].department_id !== departmentId) {
        throw httpError(403, 'You can only post announcements to your own department');
      }
    }
    if (audience === 'course') {
      const { rows } = await query('SELECT id FROM courses WHERE id = ? AND faculty_id = ?', [
        courseId, req.user.id,
      ]);
      if (!rows[0]) {
        throw httpError(403, 'You can only post announcements to courses you teach');
      }
    }
  }

  let parsedImage = null;
  if (imageData) {
    parsedImage = parseImageData(imageData);
  }

  const { insertId } = await query(
    `INSERT INTO announcements (title, body, posted_by, audience, department_id, course_id, image_data, image_mime)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      body,
      req.user.id,
      audience,
      audience === 'department' ? departmentId ?? null : null,
      audience === 'course' ? courseId ?? null : null,
      parsedImage ? parsedImage.buffer : null,
      parsedImage ? parsedImage.mime : null,
    ],
  );

  const { rows } = await query(
    `SELECT ${ANNOUNCEMENT_COLUMNS} FROM announcements WHERE id = ?`,
    [insertId],
  );

  await writeAudit(null, req.user.id, 'announcement.create', 'announcements', rows[0].id);
  return res.status(201).json({ announcement: rows[0] });
}

export async function getAnnouncementImage(req, res) {
  const { id } = req.params;
  const { rows } = await query(
    'SELECT image_data, image_mime FROM announcements WHERE id = ?',
    [id],
  );
  const row = rows[0];
  if (!row || !row.image_data) {
    throw httpError(404, 'Announcement image not found');
  }
  const image = Buffer.isBuffer(row.image_data)
    ? row.image_data
    : Buffer.from(row.image_data);

  res.set({
    'Content-Type': row.image_mime,
    'Content-Length': image.length,
    'Cache-Control': 'public, max-age=86400',
    'Cross-Origin-Resource-Policy': 'cross-origin',
  });
  return res.send(image);
}

export async function remove(req, res) {
  const { id } = req.params;
  const { rows } = await query('SELECT posted_by FROM announcements WHERE id = ?', [id]);
  const announcement = rows[0];

  if (!announcement) {
    throw httpError(404, 'Announcement not found');
  }
  if (req.user.role !== 'admin' && announcement.posted_by !== req.user.id) {
    throw httpError(403, 'You can only delete your own announcements');
  }

  await query('DELETE FROM announcements WHERE id = ?', [id]);
  await writeAudit(null, req.user.id, 'announcement.delete', 'announcements', id);
  return res.json({ message: 'Announcement deleted' });
}
