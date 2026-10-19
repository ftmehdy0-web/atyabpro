import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { categories } from '../data/catalog';
import { pick, useLang } from '../i18n/lang';
import { SITE, whatsappLink } from '../lib/site';
import { useCart, useCartActions } from '../state/cart';
import { useWishlist } from '../state/wishlist';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Sheet } from './Sheet';

/** The black strip above the header: one line at a time, changing every few seconds. */
function Announce() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setI((n) => (n + 1) % t.announce.length), 4500);
    return () => window.clearInterval(timer);
  }, [t]);
  return (
    <div className="announce">
      <p key={i} className="announce__line">{t.announce[i % t.announce.length]}</p>
    </div>
  );
}

/** Switches between English and Arabic; the label is always in the language it switches to. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, t, setLang } = useLang();
  const next = lang === 'ar' ? 'en' : 'ar';
  return (
    <button type="button" className={`lang ${className}`} onClick={() => setLang(next)} lang={next} aria-label={t.switchLabel}>
      <span className="lang__full">{t.switchTo}</span>
      <span className="lang__short" aria-hidden="true">{next === 'ar' ? 'ع' : 'EN'}</span>
    </button>
  );
}

/**
 * Hides the header while the visitor scrolls down past the slider and brings it
 * back as soon as they scroll up. Never hides while a sheet has the page locked.
 */
function useHeaderScroll() {
  const [state, setState] = useState({ hidden: false, scrolled: false });
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (document.documentElement.classList.contains('is-locked')) return;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      last = y;
      const hidden = delta > 0 && y > 480;
      setState((s) => (s.hidden === hidden && s.scrolled === y > 8 ? s : { hidden, scrolled: y > 8 }));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

export function Header() {
  const { lang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { count } = useCart();
  const { openDrawer } = useCartActions();
  const { ids } = useWishlist();
  const close = () => setMenuOpen(false);
  const scroll = useHeaderScroll();

  function search(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
  }

  return (
    <>
      <Announce />
      <header className={`head${scroll.hidden ? ' is-hidden' : ''}${scroll.scrolled ? ' is-scrolled' : ''}`}>
        <a className="skip" href="#main">{t.skip}</a>
        <div className="head__main">
          <div className="head__start">
            <button type="button" className="head__icon head__menu" onClick={() => setMenuOpen(true)} aria-label={t.openMenu} aria-expanded={menuOpen}>
              <Icon name="menu" />
            </button>
            <LangSwitch />
            <a className="head__wa" href={whatsappLink(t.hello)} target="_blank" rel="noopener noreferrer">
              <span className="head__wa-label">{t.whatsapp}</span>
              <span dir="ltr">{SITE.phoneDisplay}</span>
            </a>
          </div>

          <Logo />

          <div className="head__end">
            <form className="head__search" role="search" onSubmit={search}>
              <label className="sr-only" htmlFor="head-q">{t.searchProducts}</label>
              <input id="head-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchProducts} autoComplete="off" enterKeyHint="search" />
              <button type="submit" aria-label={t.search}><Icon name="search" size={18} /></button>
            </form>
            <Link to="/shop" className="head__icon head__find" aria-label={t.searchShop}>
              <Icon name="search" />
            </Link>
            <Link to="/wishlist" className="head__icon" aria-label={t.wishlistCount(ids.length)}>
              <Icon name="heart" />
              {ids.length > 0 && <span key={ids.length} className="head__count" aria-hidden="true">{ids.length}</span>}
            </Link>
            <button type="button" className="head__icon" onClick={openDrawer} aria-label={t.bagCount(count)}>
              <Icon name="bag" />
              {count > 0 && <span key={count} className="head__count" aria-hidden="true">{count}</span>}
            </button>
          </div>
        </div>

        <nav className="head__nav" aria-label={t.collections}>
          <NavLink to="/shop" end className="head__link">{t.shopAll}</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/shop/${c.path}`} className="head__link">
              {pick(lang, c)}
            </NavLink>
          ))}
        </nav>
      </header>

      <Sheet open={menuOpen} onClose={close} label={t.menu} side="full">
        <nav className="menu" aria-label={t.menu}>
          <Link to="/shop" className="menu__link" onClick={close}>{t.shopAll}</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.path}`} className="menu__link" onClick={close}>
              {pick(lang, c)}
              <span className="menu__ar" lang={lang === 'ar' ? 'en' : 'ar'} dir="auto">{lang === 'ar' ? c.name : c.nameAr}</span>
            </Link>
          ))}
          <Link to="/wishlist" className="menu__link menu__link--small" onClick={close}>{t.wishlist} ({ids.length})</Link>
          <Link to="/bag" className="menu__link menu__link--small" onClick={close}>{t.bag} ({count})</Link>
          <a className="menu__link menu__link--small" href={whatsappLink(t.hello)} target="_blank" rel="noopener noreferrer">
            {t.whatsapp} <span dir="ltr">{SITE.phoneDisplay}</span>
          </a>
          <LangSwitch className="menu__lang" />
        </nav>
      </Sheet>
    </>
  );
}
