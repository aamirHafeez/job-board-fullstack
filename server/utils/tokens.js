import { createHash, randomBytes } from 'crypto';

export function createPlainToken() {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function getSessionExpiry() {
  const days = Number(process.env.AUTH_SESSION_DAYS) || 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}
