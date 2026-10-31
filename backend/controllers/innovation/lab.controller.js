import { query, withTransaction } from '../../db/pool.js';
import { writeAudit } from '../../utils/audit.js';
import { httpError } from '../../utils/httpError.js';
import {
  assertDateNotPast,
  isAdmin,
  notify,
  notifyAdmins,
  parsePositiveId,
} from './common.js';

const BOOKING_SELECT = `
  SELECT b.id, b.user_id, b.equipment_id, b.facility, b.purpose,
         DATE_FORMAT(b.requested_date, '%Y-%m-%d') AS requested_date,
         TIME_FORMAT(b.start_time, '%H:%i') AS start_time,
         TIME_FORMAT(b.end_time, '%H:%i') AS end_time,
         b.team_size, b.status, b.admin_note, b.reviewed_by, b.reviewed_at,
         b.created_at, b.updated_at,
         u.name AS user_name, u.email AS user_email,
         e.name AS equipment_name, e.category AS equipment_category
  FROM innovation_lab_bookings b
  JOIN users u ON u.id = b.user_id
  LEFT JOIN innovation_lab_equipment e ON e.id = b.equipment_id`;

export async function listEquipment(_req, res) {
  const { rows } = await query(
    `SELECT id, name, category, description, quantity, status, created_at, updated_at
     FROM innovation_lab_equipment
     ORDER BY status ASC, category ASC, name ASC`,
  );
  return res.json({ equipment: rows });
}

export async function createEquipment(req, res) {
  const {
    name, category, description, quantity = 1, status = 'available',
  } = req.body;

  const { insertId } = await query(
    `INSERT INTO innovation_lab_equipment (name, category, description, quantity, status)
     VALUES (?, ?, ?, ?, ?)`,
    [name, category, description || null, quantity, status],
  );
  await writeAudit(null, req.user.id, 'innovation_lab.equipment_create', 'innovation_lab_equipment', insertId);
  const { rows } = await query('SELECT * FROM innovation_lab_equipment WHERE id = ?', [insertId]);
  return res.status(201).json({ equipment: rows[0] });
}

export async function updateEquipment(req, res) {
  const id = parsePositiveId(req.params.id, 'equipment id');
  const {
    name, category, description, quantity, status,
  } = req.body;

  const { rowCount } = await query(
    `UPDATE innovation_lab_equipment
     SET name = ?, category = ?, description = ?, quantity = ?, status = ?
     WHERE id = ?`,
    [name, category, description || null, quantity, status, id],
  );
  if (!rowCount) throw httpError(404, 'Equipment not found');
  await writeAudit(null, req.user.id, 'innovation_lab.equipment_update', 'innovation_lab_equipment', id);
  const { rows } = await query('SELECT * FROM innovation_lab_equipment WHERE id = ?', [id]);
  return res.json({ equipment: rows[0] });
}

export async function deleteEquipment(req, res) {
  const id = parsePositiveId(req.params.id, 'equipment id');
  const { rowCount } = await query('DELETE FROM innovation_lab_equipment WHERE id = ?', [id]);
  if (!rowCount) throw httpError(404, 'Equipment not found');
  await writeAudit(null, req.user.id, 'innovation_lab.equipment_delete', 'innovation_lab_equipment', id);
  return res.json({ message: 'Equipment removed' });
}

export async function listBookings(req, res) {
  let where = '';
  let params = [];
  if (!isAdmin(req.user)) {
    where = 'WHERE b.user_id = ?';
    params = [req.user.id];
  }

  const { rows } = await query(
    `${BOOKING_SELECT}
     ${where}
     ORDER BY FIELD(b.status, 'pending', 'approved', 'completed', 'cancelled', 'rejected'),
              b.requested_date DESC, b.start_time ASC
     LIMIT 300`,
    params,
  );
  return res.json({ bookings: rows });
}

export async function createBooking(req, res) {
  const {
    equipment_id: equipmentId, facility, purpose,
    requested_date: requestedDate, start_time: startTime, end_time: endTime,
    team_size: teamSize = 1,
  } = req.body;

  assertDateNotPast(requestedDate, 'Booking date');
  if (endTime <= startTime) throw httpError(400, 'End time must be after start time');
  if (!equipmentId && !facility) throw httpError(400, 'Select equipment or enter a lab facility');

  if (equipmentId) {
    const equipment = await query(
      'SELECT id, name, status FROM innovation_lab_equipment WHERE id = ?',
      [equipmentId],
    );
    const item = equipment.rows[0];
    if (!item) throw httpError(400, 'Selected equipment does not exist');
    if (item.status !== 'available') throw httpError(400, 'Selected equipment is not available');

    const conflict = await query(
      `SELECT id FROM innovation_lab_bookings
       WHERE equipment_id = ? AND requested_date = ? AND status = 'approved'
         AND start_time < ? AND end_time > ?
       LIMIT 1`,
      [equipmentId, requestedDate, endTime, startTime],
    );
    if (conflict.rows[0]) {
      throw httpError(409, 'The equipment is already booked for the selected time');
    }
  }

  const booking = await withTransaction(async (client) => {
    const { insertId } = await client.query(
      `INSERT INTO innovation_lab_bookings
         (user_id, equipment_id, facility, purpose, requested_date, start_time, end_time, team_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        equipmentId ?? null,
        facility || null,
        purpose,
        requestedDate,
        startTime,
        endTime,
        teamSize,
      ],
    );

    await notifyAdmins(client, {
      title: 'New IDEA Lab booking request',
      message: `${req.user.name} requested a lab slot on ${requestedDate}.`,
      type: 'lab',
      link: '/innovation/portal/admin',
    });

    await writeAudit(client, req.user.id, 'innovation_lab.booking_create', 'innovation_lab_bookings', insertId);
    const { rows } = await client.query(`${BOOKING_SELECT} WHERE b.id = ?`, [insertId]);
    return rows[0];
  });

  return res.status(201).json({ booking });
}

export async function updateBooking(req, res) {
  const id = parsePositiveId(req.params.id, 'booking id');
  const { status, admin_note: adminNote } = req.body;

  const existing = await query(
    `SELECT id, user_id, equipment_id,
            DATE_FORMAT(requested_date, '%Y-%m-%d') AS requested_date,
            TIME_FORMAT(start_time, '%H:%i:%s') AS start_time,
            TIME_FORMAT(end_time, '%H:%i:%s') AS end_time,
            purpose
     FROM innovation_lab_bookings WHERE id = ?`,
    [id],
  );
  const booking = existing.rows[0];
  if (!booking) throw httpError(404, 'Booking not found');

  if (status === 'approved' && booking.equipment_id) {
    const conflict = await query(
      `SELECT id FROM innovation_lab_bookings
       WHERE equipment_id = ? AND requested_date = ? AND status = 'approved'
         AND id <> ? AND start_time < ? AND end_time > ?
       LIMIT 1`,
      [booking.equipment_id, booking.requested_date, id, booking.end_time, booking.start_time],
    );
    if (conflict.rows[0]) {
      throw httpError(409, 'Another approved booking overlaps this time slot');
    }
  }

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE innovation_lab_bookings
       SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, adminNote || null, req.user.id, id],
    );

    await notify(client, booking.user_id, {
      title: 'IDEA Lab booking updated',
      message: adminNote || `Your lab booking is now ${status}.`,
      type: 'lab',
      link: '/innovation/portal/lab',
    });

    await writeAudit(client, req.user.id, 'innovation_lab.booking_update', 'innovation_lab_bookings', id);
  });

  const { rows } = await query(`${BOOKING_SELECT} WHERE b.id = ?`, [id]);
  return res.json({ booking: rows[0] });
}

export async function cancelBooking(req, res) {
  const id = parsePositiveId(req.params.id, 'booking id');
  const { rows } = await query(
    'SELECT id, user_id, status FROM innovation_lab_bookings WHERE id = ?',
    [id],
  );
  const booking = rows[0];
  if (!booking) throw httpError(404, 'Booking not found');
  if (!isAdmin(req.user) && booking.user_id !== req.user.id) {
    throw httpError(403, 'You can only cancel your own booking');
  }
  if (['completed', 'cancelled', 'rejected'].includes(booking.status)) {
    throw httpError(400, 'This booking cannot be cancelled');
  }

  await query("UPDATE innovation_lab_bookings SET status = 'cancelled' WHERE id = ?", [id]);
  await writeAudit(null, req.user.id, 'innovation_lab.booking_cancel', 'innovation_lab_bookings', id);
  return res.json({ message: 'Booking cancelled' });
}
