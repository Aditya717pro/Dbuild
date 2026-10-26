import { query } from '../db/pool.js';

/**
 * Write an audit record. Failures are logged but never break the request.
 * Pass a transaction client when the write must share the caller's transaction.
 */
export async function writeAudit(client, actorId, action, entity, entityId) {
  const runner = client ?? { query };
  try {
    await runner.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id)
       VALUES (?, ?, ?, ?)`,
      [actorId ?? null, action, entity, entityId == null ? null : String(entityId)],
    );
  } catch (err) {
    console.error('[audit] failed to write audit log:', err.message);
  }
}
