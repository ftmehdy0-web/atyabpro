import { useEffect, useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import type { AuthError, SupabaseClient, User } from '@supabase/supabase-js';
import { useLang } from '../i18n/lang';
import type { Strings } from '../i18n/strings';
import { whatsappLink } from '../lib/site';
import { accountsReady, accountUrl, getSupabase } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';

type Mode = 'signin' | 'signup' | 'reset';
type Errors = Strings['account']['errors'];

/** Supabase's error codes, in the visitor's language; anything unexpected gets the general line. */
function errorText(e: AuthError, errors: Errors) {
  const code = (e.code ?? '') as keyof Errors;
  return code in errors ? errors[code] : errors.general;
}

export default function Account() {
  const { t } = useLang();
  const a = t.account;
  useSeo(a.title, t.seo.account);

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(accountsReady);
  // Set when the visitor arrives from a password-reset email.
  const [recovering, setRecovering] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!accountsReady) return;
    let unsubscribe = () => {};
    let live = true;
    getSupabase()
      .then((sb) => {
        if (!live) return;
        setSupabase(sb);
        const { data } = sb.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
          if (event === 'PASSWORD_RECOVERY') setRecovering(true);
          setChecking(false);
        });
        unsubscribe = () => data.subscription.unsubscribe();
      })
      .catch(() => {
        setLoadFailed(true);
        setChecking(false);
      });
    return () => {
      live = false;
      unsubscribe();
    };
  }, []);

  let body;
  if (!accountsReady || loadFailed) {
    body = (
      <div className="empty empty--left">
        <p>{loadFailed ? a.errors.general : a.notReady}</p>
        <a className="button" href={whatsappLink(t.helloOrder)} target="_blank" rel="noopener noreferrer">{t.footer.orderOnWa}</a>
      </div>
    );
  } else if (checking || !supabase) {
    body = <p className="note" aria-busy="true">{a.checking}</p>;
  } else if (recovering && user) {
    body = <NewPassword supabase={supabase} onDone={() => setRecovering(false)} />;
  } else if (user) {
    body = <SignedIn supabase={supabase} user={user} />;
  } else {
    body = <SignInForms supabase={supabase} />;
  }

  return (
    <div className="account">
      <h1 className="page-title">{a.title}</h1>
      {body}
    </div>
  );
}

function SignedIn({ supabase, user }: { supabase: SupabaseClient; user: User }) {
  const { t } = useLang();
  const a = t.account;
  const [busy, setBusy] = useState(false);
  const name = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';
  return (
    <div className="account__card">
      <p className="account__hello">{name ? a.helloName(name) : a.hello}</p>
      <p className="note">{a.signedInAs} <bdi dir="ltr">{user.email}</bdi></p>
      <div className="empty__actions">
        <Link to="/bag" className="button button--quiet">{t.bag}</Link>
        <Link to="/wishlist" className="button button--quiet">{t.wishlist}</Link>
      </div>
      <button
        type="button"
        className="text-button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await supabase.auth.signOut();
          setBusy(false);
        }}
      >
        {a.signOut}
      </button>
    </div>
  );
}

function SignInForms({ supabase }: { supabase: SupabaseClient }) {
  const { t } = useLang();
  const a = t.account;
  const id = useId();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');

  function switchTo(m: Mode) {
    setMode(m);
    setError('');
    setSent('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSent('');
    setBusy(true);
    const address = email.trim();
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email: address, password });
      if (error) setError(errorText(error, a.errors));
    } else if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: address,
        password,
        options: { data: { full_name: name.trim() }, emailRedirectTo: accountUrl() },
      });
      if (error) setError(errorText(error, a.errors));
      // With email confirmation on, there is no session until the link is followed.
      else if (!data.session) setSent(a.confirmSent(address));
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(address, { redirectTo: accountUrl() });
      if (error) setError(errorText(error, a.errors));
      else setSent(a.resetSent(address));
    }
    setBusy(false);
  }

  return (
    <div className="account__card">
      {mode !== 'reset' && (
        <div className="account__tabs" role="group" aria-label={a.title}>
          <button type="button" aria-pressed={mode === 'signin'} onClick={() => switchTo('signin')}>{a.signIn}</button>
          <button type="button" aria-pressed={mode === 'signup'} onClick={() => switchTo('signup')}>{a.createAccount}</button>
        </div>
      )}
      {mode === 'reset' && <p>{a.resetIntro}</p>}

      <form className="account__form" onSubmit={submit}>
        {mode === 'signup' && (
          <label className="account__field">
            <span>{a.name}</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
          </label>
        )}
        <label className="account__field">
          <span>{a.email}</span>
          <input
            className="field"
            type="email"
            inputMode="email"
            spellCheck={false}
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        {mode !== 'reset' && (
          <label className="account__field">
            <span>{a.password}</span>
            <input
              className="field"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={mode === 'signup' ? 8 : undefined}
              aria-describedby={mode === 'signup' ? `${id}-pw` : undefined}
              required
            />
            {mode === 'signup' && <small id={`${id}-pw`} className="note">{a.passwordHint}</small>}
          </label>
        )}

        <p className={error ? 'signup__msg signup__msg--error' : 'signup__msg'} role="status" aria-live="polite">{error || sent}</p>

        <button type="submit" className="button button--ink button--full" disabled={busy}>
          {mode === 'signin' ? a.signIn : mode === 'signup' ? a.createAccount : a.sendReset}
        </button>
      </form>

      {mode === 'signin' && <button type="button" className="text-button" onClick={() => switchTo('reset')}>{a.forgot}</button>}
      {mode === 'reset' && <button type="button" className="text-button" onClick={() => switchTo('signin')}>{a.backToSignIn}</button>}
    </div>
  );
}

function NewPassword({ supabase, onDone }: { supabase: SupabaseClient; onDone: () => void }) {
  const { t } = useLang();
  const a = t.account;
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(errorText(error, a.errors));
    else onDone();
  }

  return (
    <div className="account__card">
      <p>{a.newPasswordIntro}</p>
      <form className="account__form" onSubmit={submit}>
        <label className="account__field">
          <span>{a.newPassword}</span>
          <input className="field" type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
          <small className="note">{a.passwordHint}</small>
        </label>
        <p className="signup__msg signup__msg--error" role="status" aria-live="polite">{error}</p>
        <button type="submit" className="button button--ink button--full" disabled={busy}>{a.savePassword}</button>
      </form>
    </div>
  );
}
