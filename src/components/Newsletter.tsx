import { useId, useState, type FormEvent } from 'react';
import { useLang } from '../i18n/lang';
import { mailtoLink } from '../lib/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up. There is no mailing-list service connected yet, so a valid
 * address opens the visitor's email app with the sign-up request addressed to Atyab.
 */
export function Newsletter() {
  const { t } = useLang();
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<'' | 'empty' | 'bad'>('');
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError('empty');
    if (!EMAIL.test(value)) return setError('bad');
    setError('');
    setSent(true);
    window.location.href = mailtoLink(t.newsletter.subject, t.newsletter.body(value));
  }

  return (
    <form className="signup" onSubmit={submit} noValidate>
      <label htmlFor={id} className="signup__label">{t.newsletter.label}</label>
      <div className="signup__row">
        <input
          id={id}
          type="email"
          name="email"
          spellCheck={false}
          inputMode="email"
          autoComplete="email"
          className="field"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-msg`}
          placeholder="name@example.com"
          dir="ltr"
        />
        <button type="submit" className="button button--ink">{t.newsletter.signUp}</button>
      </div>
      <p id={`${id}-msg`} className={error ? 'signup__msg signup__msg--error' : 'signup__msg'} aria-live="polite">
        {error ? t.newsletter[error] : sent ? t.newsletter.sent : t.newsletter.hint}
      </p>
    </form>
  );
}
