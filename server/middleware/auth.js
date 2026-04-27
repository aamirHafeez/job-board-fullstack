import { findUserByToken } from '../models/userModel.js';

export function getBearerToken(req) {
  const header = req.get('authorization') || '';

  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice(7).trim();
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Please sign in to continue.' });
    }

    const user = await findUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
