import { deleteSession, createSession, createUser, findUserByEmail, findUserById } from '../models/userModel.js';
import { getBearerToken } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

function validateAuthInput({ name, email, password }, isSignup = false) {
  const errors = [];
  const cleanName = name?.trim() || '';
  const cleanEmail = email?.trim().toLowerCase() || '';

  if (isSignup && cleanName.length < 2) {
    errors.push('Name must be at least 2 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.push('Enter a valid email address.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  return {
    errors,
    values: {
      name: cleanName,
      email: cleanEmail,
      password
    }
  };
}

async function sendAuthResponse(res, user) {
  const token = await createSession(user.id);
  const safeUser = await findUserById(user.id);

  res.json({
    token,
    user: safeUser
  });
}

export async function signup(req, res, next) {
  try {
    const { errors, values } = validateAuthInput(req.body, true);

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const passwordHash = await hashPassword(values.password);
    const user = await createUser({
      name: values.name,
      email: values.email,
      passwordHash
    });

    res.status(201);
    await sendAuthResponse(res, user);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    next(error);
  }
}

export async function signin(req, res, next) {
  try {
    const { errors, values } = validateAuthInput(req.body);

    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed.', errors });
    }

    const user = await findUserByEmail(values.email);
    const passwordMatches = user ? await verifyPassword(values.password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    await sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}

export async function signout(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (token) {
      await deleteSession(token);
    }

    res.json({ message: 'Signed out successfully.' });
  } catch (error) {
    next(error);
  }
}
