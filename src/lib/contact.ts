// Pure helpers for the sign-in form: no React, no network, easy to test.

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Supabase sends 6 digits by default and allows up to 10 in the project's settings. */
export const CODE = /^\d{6,10}$/;
const E164 = /^\+[1-9]\d{7,14}$/;

/** Country calling codes offered next to the mobile number field. Saudi Arabia first. */
export const DIAL_CODES = [
  { iso: 'SA', dial: '+966' },
  { iso: 'AE', dial: '+971' },
  { iso: 'KW', dial: '+965' },
  { iso: 'BH', dial: '+973' },
  { iso: 'QA', dial: '+974' },
  { iso: 'OM', dial: '+968' },
  { iso: 'JO', dial: '+962' },
  { iso: 'EG', dial: '+20' },
  { iso: 'IN', dial: '+91' },
  { iso: 'GB', dial: '+44' },
  { iso: 'US', dial: '+1' },
] as const;

/** Arabic-Indic and Persian digits become 0-9, so a number typed on an Arabic keyboard still works. */
export function westernDigits(s: string): string {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Turns what the visitor typed into E.164 (+966501234567), or '' when it cannot be a phone number.
 * A number that already starts with + or 00 is taken as complete; otherwise the chosen
 * country code is added and a leading trunk zero (0501234567) is dropped.
 */
export function toE164(dial: string, input: string): string {
  const typed = westernDigits(input).trim();
  if (!typed) return '';
  const digits = typed.replace(/\D/g, '');
  let full: string;
  if (typed.startsWith('+')) full = `+${digits}`;
  else if (typed.startsWith('00')) full = `+${digits.slice(2)}`;
  else full = `${dial}${digits.replace(/^0+/, '')}`;
  return E164.test(full) ? full : '';
}

/** Only same-site paths may be used as a "go back to" target, never another address. */
export function safeNext(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  return value;
}
