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
    'SELECT id, name, email, role, is_active FROM users WHERE id = ?',
    [id],
  );
  const user = rows[0];

  if (!user || !user.is_active) {
    return res.status(401).json({ error: 'Account is inactive or no longer exists' });
  }

  req.user = user;
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
