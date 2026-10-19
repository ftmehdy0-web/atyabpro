import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { categories } from '../data/catalog';
import { SITE, whatsappLink } from '../lib/site';
import { useCart, useCartActions } from '../state/cart';
import { useWishlist } from '../state/wishlist';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Sheet } from './Sheet';

const notices = [
  `Order on WhatsApp · ${SITE.phoneDisplay}`,
  'Nineteen pieces of oud, musk and bakhoor',
  'Prices in Saudi riyals, confirmed before you pay',
];

/** The black strip above the header: one line at a time, changing every few seconds. */
function Announce() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % notices.length), 4500);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="announce">
      <p key={i} className="announce__line">{notices[i]}</p>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { count } = useCart();
  const { openDrawer } = useCartActions();
  const { ids } = useWishlist();
  const close = () => setMenuOpen(false);

  function search(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
  }

  return (
    <>
      <Announce />
      <header className="head">
        <a className="skip" href="#main">Skip to content</a>
        <div className="head__main">
          <div className="head__start">
            <button type="button" className="head__icon head__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Icon name="menu" />
            </button>
            <a className="head__wa" href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer">
              <span className="head__wa-label">WhatsApp</span>
              <span dir="ltr">{SITE.phoneDisplay}</span>
            </a>
          </div>

          <Logo />

          <div className="head__end">
            <form className="head__search" role="search" onSubmit={search}>
              <label className="sr-only" htmlFor="head-q">Search products</label>
              <input id="head-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" autoComplete="off" enterKeyHint="search" />
              <button type="submit" aria-label="Search"><Icon name="search" size={18} /></button>
            </form>
            <Link to="/shop" className="head__icon head__find" aria-label="Search the shop">
              <Icon name="search" />
            </Link>
            <Link to="/wishlist" className="head__icon" aria-label={`Wishlist, ${ids.length} saved`}>
              <Icon name="heart" />
              {ids.length > 0 && <span className="head__count" aria-hidden="true">{ids.length}</span>}
            </Link>
            <button type="button" className="head__icon" onClick={openDrawer} aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <Icon name="bag" />
              {count > 0 && <span className="head__count" aria-hidden="true">{count}</span>}
            </button>
          </div>
        </div>

        <nav className="head__nav" aria-label="Collections">
          <NavLink to="/shop" end className="head__link">Shop all</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/shop/${c.path}`} className="head__link">
              {c.name}
            </NavLink>
          ))}
        </nav>
      </header>

      <Sheet open={menuOpen} onClose={close} label="Menu" side="full">
        <nav className="menu" aria-label="Menu">
          <Link to="/shop" className="menu__link" onClick={close}>Shop all</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.path}`} className="menu__link" onClick={close}>
              {c.name}
              <span className="menu__ar" lang="ar" dir="rtl">{c.nameAr}</span>
            </Link>
          ))}
          <Link to="/wishlist" className="menu__link menu__link--small" onClick={close}>Wishlist ({ids.length})</Link>
          <Link to="/bag" className="menu__link menu__link--small" onClick={close}>Bag ({count})</Link>
          <a className="menu__link menu__link--small" href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer">
            WhatsApp <span dir="ltr">{SITE.phoneDisplay}</span>
          </a>
        </nav>
      </Sheet>
    </>
  );
}
