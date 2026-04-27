import { pool } from '../config/database.js';
import { createPlainToken, getSessionExpiry, hashToken } from '../utils/tokens.js';

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

export async function createUser({ name, email, passwordHash }) {
  const [result] = await pool.execute(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `,
    [name, email, passwordHash]
  );

  return findUserById(result.insertId);
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        email,
        password_hash AS passwordHash,
        created_at AS createdAt
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        email,
        created_at AS createdAt
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return normalizeUser(rows[0]);
}

export async function createSession(userId) {
  const token = createPlainToken();
  const tokenHash = hashToken(token);
  const expiresAt = getSessionExpiry();

  await pool.execute(
    `
      INSERT INTO auth_tokens (user_id, token_hash, expires_at)
      VALUES (?, ?, ?)
    `,
    [userId, tokenHash, expiresAt]
  );

  return token;
}

export async function findUserByToken(token) {
  const [rows] = await pool.execute(
    `
      SELECT
        users.id,
        users.name,
        users.email,
        users.created_at AS createdAt
      FROM auth_tokens
      INNER JOIN users ON users.id = auth_tokens.user_id
      WHERE auth_tokens.token_hash = ?
        AND auth_tokens.expires_at > NOW()
      LIMIT 1
    `,
    [hashToken(token)]
  );

  return normalizeUser(rows[0]);
}

export async function deleteSession(token) {
  await pool.execute('DELETE FROM auth_tokens WHERE token_hash = ?', [hashToken(token)]);
}
