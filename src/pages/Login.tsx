import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n/lang';
import type { Strings } from '../i18n/strings';
import { CODE, DIAL_CODES, EMAIL, safeNext, toE164, westernDigits } from '../lib/contact';
import { AuthError, googleUrl, sendEmailCode, sendPhoneCode, verifyCode } from '../lib/supabase';
import { useSeo } from '../lib/useSeo';
import { useAuth } from '../state/auth';

const base = import.meta.env.BASE_URL;
const RESEND_AFTER = 30;
const NEXT_KEY = 'atyab.next';

type Method = 'email' | 'phone';
type Step = 'enter' | 'code';
type ErrorKey = keyof Strings['login']['errors'];

/** Where Supabase should send the visitor back to: this page, which then reads the session from the address. */
const loginUrl = () => `${window.location.origin}${base}login`;

// Google leaves the site and comes back, so the page to return to is kept for the round trip.
function rememberNext(path: string) {
  try {
    sessionStorage.setItem(NEXT_KEY, path);
  } catch {
    // Without storage the visitor simply lands on the account panel afterwards.
  }
}
function takeNext(): string | null {
  try {
    const v = sessionStorage.getItem(NEXT_KEY);
    sessionStorage.removeItem(NEXT_KEY);
    return safeNext(v);
  } catch {
    return null;
  }
}

function errorKey(e: unknown, where: 'send' | 'verify', method: Method): ErrorKey {
  if (!(e instanceof AuthError)) return 'generic';
  if (e.status === 0) return 'network';
  if (e.status === 429 || e.code.includes('rate_limit')) return 'tooMany';
  if (where === 'verify') return e.status >= 500 ? 'generic' : 'codeWrong';
  if (e.code === 'phone_provider_disabled' || e.code === 'sms_send_failed') return 'phoneOff';
  if (e.code === 'email_provider_disabled' || e.code === 'otp_disabled') return method === 'phone' ? 'phoneOff' : 'emailOff';
  return 'generic';
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

export default function Login() {
  const { t } = useLang();
  const m = t.login;
  useSeo(t.seo.login, t.seo.loginDesc);

  const { user, ready, callbackError, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next')) ?? '/';
  const id = useId();

  const [method, setMethod] = useState<Method>('email');
  const [step, setStep] = useState<Step>('enter');
  const [email, setEmail] = useState('');
  const [dial, setDial] = useState<string>(DIAL_CODES[0].dial);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | ''>('');
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  // Back from Google: carry on to the page the visitor came from.
  useEffect(() => {
    if (!ready || !user) return;
    const to = takeNext();
    if (to) navigate(to, { replace: true });
  }, [ready, user, navigate]);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  function pickMethod(to: Method) {
    if (to === method) return;
    setMethod(to);
    setError('');
  }

  async function send(e?: FormEvent) {
    e?.preventDefault();
    if (busy) return;
    let target: string;
    if (method === 'email') {
      target = email.trim();
      if (!target) return setError('emailEmpty');
      if (!EMAIL.test(target)) return setError('emailBad');
    } else {
      if (!phone.trim()) return setError('phoneEmpty');
      target = toE164(dial, phone);
      if (!target) return setError('phoneBad');
    }
    setBusy(true);
    setError('');
    try {
      if (method === 'email') await sendEmailCode(target, loginUrl());
      else await sendPhoneCode(target);
      setSentTo(target);
      setCode('');
      setStep('code');
      setCooldown(RESEND_AFTER);
    } catch (err) {
      setError(errorKey(err, 'send', method));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const token = westernDigits(code).replace(/\s/g, '');
    if (!CODE.test(token)) return setError('codeBad');
    setBusy(true);
    setError('');
    try {
      const session = await verifyCode(method === 'email' ? { email: sentTo } : { phone: sentTo }, token);
      signIn(session);
      takeNext();
      navigate(next, { replace: true });
    } catch (err) {
      setError(errorKey(err, 'verify', method));
      setBusy(false);
    }
  }

  function startGoogle() {
    rememberNext(next);
    window.location.href = googleUrl(loginUrl());
  }

  function backToEntry() {
    setStep('enter');
    setCode('');
    setError('');
  }

  const message = error ? m.errors[error] : step === 'enter' && callbackError ? m.errors.google : '';
  const who = user ? (user.name ?? user.email ?? user.phone ?? '') : '';

  return (
    <div className="login">
      <aside className="login__art" aria-hidden="true">
        <img src={`${base}images/hero_slide_1-800.webp`} alt="" decoding="async" />
        <div className="login__art-text">
          <p className="eyebrow eyebrow--light">{m.artEyebrow}</p>
          <p className="login__art-title">{m.artTitle}</p>
        </div>
      </aside>

      <section className="login__panel" aria-labelledby={`${id}-title`}>
        {!ready ? (
          <div className="login__wait" aria-busy="true" />
        ) : user ? (
          <div className="login__done">
            <p className="eyebrow">{m.eyebrow}</p>
            <h1 id={`${id}-title`} className="page-title">{m.signedIn}</h1>
            <p className="login__who">
              {m.signedInAs} <bdi dir="auto">{who}</bdi>
            </p>
            <div className="login__actions">
              <Link to="/shop" className="button button--ink">{m.continue}</Link>
              <button type="button" className="button button--line" onClick={() => void signOut()}>{m.signOut}</button>
            </div>
          </div>
        ) : (
          <>
            <header className="login__head">
              <p className="eyebrow">{m.eyebrow}</p>
              <h1 id={`${id}-title`} className="page-title">{m.title}</h1>
              <p className="login__lead">{m.lead}</p>
            </header>

            {step === 'enter' ? (
              <>
                <button type="button" className="button button--quiet button--full login__google" onClick={startGoogle}>
                  <GoogleMark />
                  {m.google}
                </button>

                <p className="login__or" aria-hidden="true"><span>{m.or}</span></p>

                <form className="login__form" onSubmit={send} noValidate>
                  <div className="login__method" role="group" aria-label={m.methodLabel}>
                    <button type="button" className="chip" aria-pressed={method === 'email'} onClick={() => pickMethod('email')}>{m.email}</button>
                    <button type="button" className="chip" aria-pressed={method === 'phone'} onClick={() => pickMethod('phone')}>{m.phone}</button>
                  </div>

                  {method === 'email' ? (
                    <div className="login__group">
                      <label htmlFor={`${id}-email`} className="login__label">{m.emailLabel}</label>
                      <input
                        id={`${id}-email`}
                        className="field"
                        type="email"
                        name="email"
                        inputMode="email"
                        autoComplete="email"
                        spellCheck={false}
                        dir="ltr"
                        lang="en"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        aria-invalid={error === 'emailEmpty' || error === 'emailBad' ? true : undefined}
                        aria-describedby={`${id}-msg`}
                      />
                    </div>
                  ) : (
                    <div className="login__group">
                      <label htmlFor={`${id}-phone`} className="login__label">{m.phoneLabel}</label>
                      <div className="login__phone" dir="ltr">
                        <select
                          className="field login__dial"
                          aria-label={m.dialLabel}
                          value={dial}
                          onChange={(e) => setDial(e.target.value)}
                          lang="en"
                        >
                          {DIAL_CODES.map((c) => (
                            <option key={c.iso} value={c.dial}>{c.iso} {c.dial}</option>
                          ))}
                        </select>
                        <input
                          id={`${id}-phone`}
                          className="field"
                          type="tel"
                          name="phone"
                          inputMode="tel"
                          autoComplete="tel-national"
                          lang="en"
                          placeholder="50 123 4567"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (error) setError('');
                          }}
                          aria-invalid={error === 'phoneEmpty' || error === 'phoneBad' ? true : undefined}
                          aria-describedby={`${id}-msg`}
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="button button--ink button--full" disabled={busy}>
                    {busy ? m.sending : m.sendCode}
                  </button>
                </form>
              </>
            ) : (
              <form className="login__form" onSubmit={verify} noValidate>
                <p className="login__sent">{method === 'email' ? m.sentToEmail(sentTo) : m.sentToPhone(sentTo)}</p>
                <div className="login__group">
                  <label htmlFor={`${id}-code`} className="login__label">{m.codeLabel}</label>
                  <input
                    id={`${id}-code`}
                    ref={codeRef}
                    className="field login__code"
                    type="text"
                    name="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={12}
                    spellCheck={false}
                    dir="ltr"
                    lang="en"
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError('');
                    }}
                    aria-invalid={error === 'codeBad' || error === 'codeWrong' ? true : undefined}
                    aria-describedby={`${id}-msg`}
                  />
                </div>
                <button type="submit" className="button button--ink button--full" disabled={busy}>
                  {busy ? m.verifying : m.verify}
                </button>
                <div className="login__links">
                  <button type="button" className="text-button" onClick={() => void send()} disabled={busy || cooldown > 0}>
                    {cooldown > 0 ? m.resendIn(cooldown) : m.resend}
                  </button>
                  <button type="button" className="text-button" onClick={backToEntry}>
                    {method === 'email' ? m.changeEmail : m.changePhone}
                  </button>
                </div>
              </form>
            )}

            <p id={`${id}-msg`} className={message ? 'login__msg login__msg--error' : 'login__msg'} aria-live="polite">
              {message}
            </p>
            <p className="note login__privacy">
              <Icon name="check" size={16} />
              {m.privacy}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
