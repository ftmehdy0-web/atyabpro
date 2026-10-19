import { Link } from 'react-router';

/** The Atyab mark (the brand's own calligraphy roundel) with the name set beside it. */
export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/" className="logo" onClick={onNavigate} aria-label="Atyab Perfumes, home">
      <img src="/images/atyab_logo-96.webp" srcSet="/images/atyab_logo-96.webp 1x, /images/atyab_logo-192.webp 2x" width={40} height={40} alt="" />
      <span className="logo__name">Atyab</span>
    </Link>
  );
}
