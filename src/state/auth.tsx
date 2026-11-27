import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStored, writeStored } from '../lib/storage';
import { AuthError, isSession, readCallback, refreshSession, sessionFromTokens, signOutRemote, type AuthUser, type Session } from '../lib/supabase';

const KEY = 'atyab.auth.v1';
const isStoredSession = (v: unknown): v is Session | null => isSession(v);
const nowSec = () => Math.floor(Date.now() / 1000);
/** Refresh a minute early so a request never goes out with a token about to expire. */
const EARLY = 60;

function persist(s: Session | null) {
  if (s) return writeStored(KEY, s);
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: nothing was saved to remove.
  }
}

interface Boot {
  session: Session | null;
  /** Set when Google or an emailed link sent the visitor back with an error. */
  error: string | null;
}

/**
 * Runs once per page load, even under React StrictMode's double effects: reads the session
 * Google or an emailed link left in the address (then clears it from the address bar),
 * or else restores the saved one, refreshing it if it has expired.
 */
let boot: Promise<Boot> | null = null;
function bootstrap(): Promise<Boot> {
  boot ??= run();
  return boot;
}

async function run(): Promise<Boot> {
  const cb = readCallback(window.location.hash, window.location.search);
  if (cb) {
    window.history.replaceState(null, '', window.location.pathname);
    if ('error' in cb) return { session: null, error: cb.error };
    try {
      const session = await sessionFromTokens(cb.tokens);
      persist(session);
      return { session, error: null };
    } catch {
      return { session: null, error: 'callback' };
    }
  }

  const saved = readStored<Session | null>(KEY, isStoredSession, null);
  if (!saved) return { session: null, error: null };
  if (saved.expires_at - EARLY > nowSec()) return { session: saved, error: null };
  try {
    const session = await refreshSession(saved.refresh_token);
    persist(session);
    return { session, error: null };
  } catch (e) {
    // Offline: keep what was saved and try again later. Anything else means the session is over.
    if (e instanceof AuthError && e.status === 0) return { session: saved, error: null };
    persist(null);
    return { session: null, error: null };
  }
}

interface Auth {
  user: AuthUser | null;
  /** False until the saved session has been checked, so pages don't flash a signed-out state. */
  ready: boolean;
  callbackError: string | null;
  signIn: (s: Session) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void bootstrap().then((b) => {
      if (!live) return;
      setSession(b.session);
      setCallbackError(b.error);
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  // Keep the token fresh while the page stays open.
  useEffect(() => {
    if (!session) return;
    const wait = Math.max(5, session.expires_at - EARLY - nowSec()) * 1000;
    const id = window.setTimeout(async () => {
      try {
        const next = await refreshSession(session.refresh_token);
        persist(next);
        setSession(next);
      } catch (e) {
        if (e instanceof AuthError && e.status === 0) return;
        persist(null);
        setSession(null);
      }
    }, Math.min(wait, 2 ** 31 - 1));
    return () => window.clearTimeout(id);
  }, [session]);

  // Signing in or out in another tab updates this one.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSession(readStored<Session | null>(KEY, isStoredSession, null));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signIn = useCallback((s: Session) => {
    persist(s);
    setSession(s);
    setCallbackError(null);
  }, []);

  const signOut = useCallback(async () => {
    const current = session;
    persist(null);
    setSession(null);
    if (current) {
      try {
        await signOutRemote(current.access_token);
      } catch {
        // The device is signed out either way; the server copy simply expires.
      }
    }
  }, [session]);

  const value = useMemo<Auth>(
    () => ({ user: session?.user ?? null, ready, callbackError, signIn, signOut }),
    [session, ready, callbackError, signIn, signOut],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
