import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { z } from 'zod';

import { env } from './env.js';
import { clearSessionCookie, requireAuth, setSessionCookie, signSession } from './auth.js';
import { verifyGoogleIdToken } from './google.js';
import { upsertUserAndAppendLogin } from './sheets.js';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/google', async (req, res) => {
  try {
    const bodySchema = z.object({ credential: z.string().min(10) });
    const { credential } = bodySchema.parse(req.body);

    const user = await verifyGoogleIdToken(credential);

    await upsertUserAndAppendLogin({
      user,
      ip: req.ip,
      userAgent: req.get('user-agent') ?? ''
    });

    const token = signSession(user);
    setSessionCookie(res, token);

    return res.json({
      ok: true,
      user
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(400).json({ ok: false, error: message });
  }
});

app.get('/api/me', requireAuth, (req, res) => {
  return res.json({
    ok: true,
    user: req.user
  });
});

app.post('/api/logout', (_req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true });
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${env.PORT}`);
});
