import { query } from '../db/pool.js';
import { verifyToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const id = Number(payload.sub);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.role, u.is_active,
            COALESCE(f.is_cdc, 0) AS is_cdc
     FROM users u
     LEFT JOIN faculty f ON f.user_id = u.id
     WHERE u.id = ?`,
    [id],
  );
  const user = rows[0];

  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'Account is inactive or no longer exists' });
  }

  req.user = { ...user, is_cdc: Boolean(user.is_cdc) };
  return next();
});

export function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    return next();
  };
}

export function requireCdcOrAdmin(
  message = 'Only CDC faculty and administrators can perform this action',
) {
  return function cdcOrAdminGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role === 'admin' || (req.user.role === 'faculty' && req.user.is_cdc)) {
      return next();
    }
    return res.status(403).json({ error: message });
  };
}
