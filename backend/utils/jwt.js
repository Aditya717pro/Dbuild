import jwt from 'jsonwebtoken';
import { httpError } from './httpError.js';

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 16) {
    throw httpError(500, 'Server authentication is not configured');
  }
  return value;
}

export function signToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    secret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, secret());
}
