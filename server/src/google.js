import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload?.email) {
    throw new Error('Invalid Google token payload');
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name ?? '',
    picture: payload.picture ?? ''
  };
}
