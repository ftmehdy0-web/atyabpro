import { Link } from 'react-router';

const base = import.meta.env.BASE_URL;

/** The Atyab mark (the brand's own calligraphy roundel) above the name, set in capitals. */
export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onNavigate} aria-label="Atyab Perfumes, home">
      <img src={`${base}images/atyab_logo-96.webp`} srcSet={`${base}images/atyab_logo-96.webp 1x, ${base}images/atyab_logo-192.webp 2x`} width={48} height={48} alt="" />
      <span className="logo__text">
        <span className="logo__name">Atyab</span>
        <span className="logo__sub">Perfumes</span>
      </span>
    </Link>
  );
}
