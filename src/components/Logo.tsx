import { Link } from 'react-router';
import { useLang } from '../i18n/lang';

const base = import.meta.env.BASE_URL;

/** The Atyab mark (the brand's own calligraphy roundel) above the name, set in capitals. */
export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLang();
  return (
    <Link to="/" className="logo" onClick={onNavigate} aria-label={t.home}>
      <img src={`${base}images/atyab_logo-96.webp`} srcSet={`${base}images/atyab_logo-96.webp 1x, ${base}images/atyab_logo-192.webp 2x`} width={48} height={48} alt="" />
      <span className="logo__text">
        <span className="logo__name">{t.logoName}</span>
        <span className="logo__sub">{t.logoSub}</span>
      </span>
    </Link>
  );
}
