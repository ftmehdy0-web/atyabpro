// A small Supabase Auth client over the project's public REST API (GoTrue), so the
// site needs no extra package. The URL and publishable key are meant to be public:
// they only identify the project, and what a visitor may do is set by Supabase itself.
// Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to point at another project.

export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL || 'https://yieonmciwybaffouoydm.supabase.co';
const PUBLISHABLE_KEY: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_WSbUcmMRPOiO-tY5c7EYBw_iH-gBwf-';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  /** Seconds since 1970, as Supabase reports it. */
  expires_at: number;
  user: AuthUser;
}

/** status 0 means the request never reached Supabase (offline, blocked). */
export class AuthError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const rec = (v: unknown): Record<string, unknown> => (typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : {});
const str = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : undefined);
const now = () => Math.floor(Date.now() / 1000);

function toUser(v: unknown): AuthUser {
  const r = rec(v);
  const meta = rec(r.user_metadata);
  const id = str(r.id);
  if (!id) throw new AuthError(500, 'bad_response', 'Supabase returned no user.');
  return {
    id,
    email: str(r.email),
    phone: str(r.phone),
    name: str(meta.full_name) ?? str(meta.name),
    avatar: str(meta.avatar_url) ?? str(meta.picture),
  };
}

function toSession(body: unknown): Session {
  const r = rec(body);
  const access_token = str(r.access_token);
  const refresh_token = str(r.refresh_token);
  if (!access_token || !refresh_token) throw new AuthError(500, 'bad_response', 'Supabase returned no session.');
  const expires_at = Number(r.expires_at) || now() + (Number(r.expires_in) || 3600);
  return { access_token, refresh_token, expires_at, user: toUser(r.user) };
}

export function isSession(v: unknown): v is Session {
  const r = rec(v);
  return !!str(r.access_token) && !!str(r.refresh_token) && typeof r.expires_at === 'number' && !!str(rec(r.user).id);
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: object;
  /** A signed-in visitor's access token. Left out, only the project key is sent. */
  token?: string;
  query?: Record<string, string>;
}

async function request(path: string, { method = 'POST', body, token, query }: RequestOptions = {}): Promise<unknown> {
  const qs = query ? `?${new URLSearchParams(query)}` : '';
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/auth/v1${path}${qs}`, {
      method,
      headers: {
        apikey: PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthError(0, 'network', 'Could not reach Supabase.');
  }
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON: fall through to the status line below.
  }
  if (!res.ok) {
    const r = rec(json);
    const code = str(r.error_code) ?? str(r.code) ?? str(r.error) ?? 'unknown';
    const message = str(r.msg) ?? str(r.message) ?? str(r.error_description) ?? res.statusText;
    throw new AuthError(res.status, code, message);
  }
  return json;
}

/** Emails the visitor a one-time code (and a sign-in link, depending on the email template). A new address creates the account. */
export async function sendEmailCode(email: string, redirectTo: string): Promise<void> {
  await request('/otp', { body: { email, create_user: true }, query: { redirect_to: redirectTo } });
}

/** Texts the visitor a one-time code. A new number creates the account. */
export async function sendPhoneCode(phone: string): Promise<void> {
  await request('/otp', { body: { phone, create_user: true, channel: 'sms' } });
}

export async function verifyCode(target: { email: string } | { phone: string }, token: string): Promise<Session> {
  const body = 'email' in target ? { type: 'email', email: target.email, token } : { type: 'sms', phone: target.phone, token };
  return toSession(await request('/verify', { body }));
}

/** Where to send the browser to start Google sign-in; Supabase brings it back to redirectTo with the session in the address. */
export function googleUrl(redirectTo: string): string {
  return `${SUPABASE_URL}/auth/v1/authorize?${new URLSearchParams({ provider: 'google', redirect_to: redirectTo })}`;
}

export async function getUser(accessToken: string): Promise<AuthUser> {
  return toUser(await request('/user', { method: 'GET', token: accessToken }));
}

export async function refreshSession(refreshToken: string): Promise<Session> {
  return toSession(await request('/token', { query: { grant_type: 'refresh_token' }, body: { refresh_token: refreshToken } }));
}

/** Ends this device's session only; other devices stay signed in. */
export async function signOutRemote(accessToken: string): Promise<void> {
  await request('/logout', { token: accessToken, query: { scope: 'local' } });
}

/** What Supabase puts in the address when it sends the visitor back from Google or from an emailed link. */
export type Callback = { tokens: { access: string; refresh: string; expiresAt?: number; expiresIn?: number } } | { error: string };

export function readCallback(hash: string, search: string): Callback | null {
  const h = new URLSearchParams(hash.replace(/^#/, ''));
  const access = h.get('access_token');
  const refresh = h.get('refresh_token');
  if (access && refresh) {
    return { tokens: { access, refresh, expiresAt: Number(h.get('expires_at')) || undefined, expiresIn: Number(h.get('expires_in')) || undefined } };
  }
  for (const p of [h, new URLSearchParams(search)]) {
    const error = p.get('error_description') || p.get('error');
    if (error) return { error };
  }
  return null;
}

export async function sessionFromTokens(t: { access: string; refresh: string; expiresAt?: number; expiresIn?: number }): Promise<Session> {
  const user = await getUser(t.access);
  return { access_token: t.access, refresh_token: t.refresh, expires_at: t.expiresAt ?? now() + (t.expiresIn ?? 3600), user };
}
