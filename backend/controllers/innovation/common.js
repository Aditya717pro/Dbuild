import { query } from '../../db/pool.js';
import { httpError } from '../../utils/httpError.js';

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 3 * 1024 * 1024;
const IMAGE_DATA_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([a-z0-9+/=\s]+)$/i;
const PDF_DATA_PATTERN = /^data:application\/pdf;base64,([a-z0-9+/=\s]+)$/i;

export function parsePositiveId(value, label = 'id') {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, `Invalid ${label}`);
  }
  return id;
}

export function assertHttpUrl(value, label = 'URL') {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) {
    throw httpError(400, `${label} must start with http:// or https://`);
  }
  return value;
}

export function normalizeDateTime(value) {
  if (!value) return null;
  const normalized = value.replace('T', ' ');
  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

export function assertDateNotPast(value, label = 'Date') {
  if (!value) return;
  const today = new Date().toISOString().slice(0, 10);
  if (value < today) {
    throw httpError(400, `${label} cannot be in the past`);
  }
}

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

function safeFileName(value, fallback) {
  const name = String(value || '').trim().replace(/[^\w.\- ()]/g, '_').slice(0, 255);
  return name || fallback;
}

export function parseImageFile(file, label = 'Image') {
  if (!file) return null;
  const match = IMAGE_DATA_PATTERN.exec(file.data || '');
  if (!match) {
    throw httpError(400, `${label} must be a PNG, JPEG, or WebP image`);
  }

  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  if (!buffer.length) throw httpError(400, `${label} is empty`);
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw httpError(400, `${label} must be smaller than 1.5 MB`);
  }
  if (!hasImageSignature(buffer, mime)) {
    throw httpError(400, `${label} is not a valid image`);
  }

  return {
    kind: 'image',
    fileName: safeFileName(file.file_name, `${label.toLowerCase()}.jpg`),
    mime,
    size: buffer.length,
    buffer,
  };
}

export function parseDocumentFile(file) {
  if (!file) return null;
  const match = PDF_DATA_PATTERN.exec(file.data || '');
  if (!match) {
    throw httpError(400, 'Supporting document must be a PDF');
  }

  const buffer = Buffer.from(match[1].replace(/\s/g, ''), 'base64');
  if (!buffer.length) throw httpError(400, 'Supporting document is empty');
  if (buffer.length > MAX_DOCUMENT_BYTES) {
    throw httpError(400, 'Supporting document must be smaller than 3 MB');
  }

  const signature = buffer.subarray(0, 5).toString('ascii');
  if (signature !== '%PDF-') {
    throw httpError(400, 'Supporting document is not a valid PDF');
  }

  return {
    kind: 'document',
    fileName: safeFileName(file.file_name, 'supporting-document.pdf'),
    mime: 'application/pdf',
    size: buffer.length,
    buffer,
  };
}

export async function insertMedia(client, table, parentColumn, parentId, images = [], document = null) {
  const parsed = [
    ...(images || []).map((file, index) => parseImageFile(file, `Project image ${index + 1}`)),
    parseDocumentFile(document),
  ].filter(Boolean);

  for (const file of parsed) {
    await client.query(
      `INSERT INTO ${table} (${parentColumn}, kind, file_name, mime, size_bytes, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [parentId, file.kind, file.fileName, file.mime, file.size, file.buffer],
    );
  }

  return parsed.length;
}

export async function notify(client, userId, { title, message, type = 'system', link = null }) {
  if (!userId) return;
  const runner = client ?? { query };
  await runner.query(
    `INSERT INTO innovation_notifications (user_id, title, message, type, link)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, title, message, type, link],
  );
}

export async function notifyAdmins(client, notification) {
  const runner = client ?? { query };
  const { rows } = await runner.query("SELECT id FROM users WHERE role = 'admin' AND is_active = 1");
  for (const row of rows) {
    await notify(client, row.id, notification);
  }
}

export async function notifyAudience(client, audience, notification) {
  const runner = client ?? { query };
  const conditions = ["is_active = 1"];
  const params = [];

  if (audience !== 'all') {
    conditions.push('role = ?');
    params.push(audience);
  }

  const { rows } = await runner.query(
    `SELECT id FROM users WHERE ${conditions.join(' AND ')}`,
    params,
  );
  for (const row of rows) {
    await notify(client, row.id, notification);
  }
}

export function isStaff(user) {
  return user?.role === 'admin' || user?.role === 'faculty';
}

export function isAdmin(user) {
  return user?.role === 'admin';
}

export async function listFeedback(entityType, entityId, client = null) {
  const runner = client ?? { query };
  const { rows } = await runner.query(
    `SELECT f.id, f.message, f.created_at, f.author_id, u.name AS author_name, u.role AS author_role
     FROM innovation_feedback f
     LEFT JOIN users u ON u.id = f.author_id
     WHERE f.entity_type = ? AND f.entity_id = ?
     ORDER BY f.created_at ASC`,
    [entityType, entityId],
  );
  return rows;
}

export async function addFeedback(req, res, entityType, entityId, ownerId, notification) {
  if (!isStaff(req.user)) {
    throw httpError(403, 'Only faculty and administrators can provide feedback');
  }
  const { message } = req.body;
  await query(
    `INSERT INTO innovation_feedback (entity_type, entity_id, author_id, message)
     VALUES (?, ?, ?, ?)`,
    [entityType, entityId, req.user.id, message],
  );
  if (ownerId && ownerId !== req.user.id) {
    await notify(null, ownerId, notification);
  }
  const feedback = await listFeedback(entityType, entityId);
  return res.status(201).json({ feedback });
}
