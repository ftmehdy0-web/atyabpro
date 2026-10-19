import { useId, useState, type FormEvent } from 'react';
import { mailtoLink } from '../lib/site';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up. There is no mailing-list service connected yet, so a valid
 * address opens the visitor's email app with the sign-up request addressed to Atyab.
 */
export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return setError('Enter your email address.');
    if (!EMAIL.test(value)) return setError('That email address looks incomplete. Check it and try again.');
    setError('');
    setSent(true);
    window.location.href = mailtoLink('Newsletter sign-up', `Please add ${value} to the Atyab newsletter.`);
  }

  return (
    <form className="signup" onSubmit={submit} noValidate>
      <label htmlFor={id} className="signup__label">Your email</label>
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
        />
        <button type="submit" className="button button--ink">Sign up</button>
      </div>
      <p id={`${id}-msg`} className={error ? 'signup__msg signup__msg--error' : 'signup__msg'} aria-live="polite">
        {error || (sent ? 'Your email app should now open with the sign-up ready to send.' : 'New scents and restocks, a few times a year.')}
      </p>
    </form>
  );
}
