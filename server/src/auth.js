import jwt from 'jsonwebtoken';
import { env } from './env.js';

export function signSession(user) {
  return jwt.sign(
    {
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture
    },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifySessionToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function setSessionCookie(res, token) {
  const isProd = env.NODE_ENV === 'production';
  res.cookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(env.SESSION_COOKIE_NAME, { path: '/' });
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const payload = verifySessionToken(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid session' });
  }
}
