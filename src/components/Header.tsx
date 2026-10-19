import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { categories } from '../data/catalog';
import { useCart, useCartActions } from '../state/cart';
import { useWishlist } from '../state/wishlist';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Sheet } from './Sheet';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { openDrawer } = useCartActions();
  const { ids } = useWishlist();
  const close = () => setMenuOpen(false);

  return (
    <header className="bar">
      <a className="skip" href="#main">Skip to content</a>
      <Logo />
      <nav className="bar__nav" aria-label="Collections">
        {categories.map((c) => (
          <NavLink key={c.id} to={`/shop/${c.path}`} className="bar__link">
            {c.name}
          </NavLink>
        ))}
      </nav>
      <div className="bar__actions">
        <Link to="/shop" className="bar__icon" aria-label="Search the shop">
          <Icon name="search" />
        </Link>
        <Link to="/wishlist" className="bar__icon bar__wish" aria-label={`Wishlist, ${ids.length} saved`}>
          <Icon name="heart" />
          {ids.length > 0 && <span className="bar__count" aria-hidden="true">{ids.length}</span>}
        </Link>
        <button type="button" className="bar__bag" onClick={openDrawer} aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
          <Icon name="bag" />
          <span className="bar__bag-label" aria-hidden="true">Bag</span>
          <span className="bar__count" aria-hidden="true">{count}</span>
        </button>
        <button type="button" className="bar__icon bar__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
          <Icon name="menu" />
        </button>
      </div>

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
        </nav>
      </Sheet>
    </header>
  );
}
