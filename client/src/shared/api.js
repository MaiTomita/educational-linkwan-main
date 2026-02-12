const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const message = json?.error || `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

export async function authWithGoogleCredential(credential) {
  return request('/api/auth/google', {
    method: 'POST',
    body: { credential }
  });
}

export async function getMe() {
  return request('/api/me');
}

export async function logout() {
  return request('/api/logout', { method: 'POST' });
}
