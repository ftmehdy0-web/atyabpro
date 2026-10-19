import { useRef } from 'react';
import { Link } from 'react-router';
import { categories } from '../data/catalog';
import { enterSections, useGSAP } from '../lib/gsap';
import { SITE, whatsappLink } from '../lib/site';
import { Icon } from './Icon';

export function Footer() {
  const year = new Date().getFullYear();
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { enterSections(root.current!); }, { scope: root });
  return (
    <footer className="foot" ref={root} data-section>
      <h2 className="sr-only">About Atyab Perfumes</h2>
      <div className="foot__tile foot__statement" data-enter>
        <p className="foot__sentence">One scent is a ṭīb. Worn together, they are atyab.</p>
        <p className="foot__legal">
          © {year} {SITE.name}. Prices in Saudi riyals. No payment is taken on this site. Rose plate: “Les Roses: Rosa Damascena,
          subalba” by Henry Joseph Redouté, CC0, via{' '}
          <a className="link-plain" href="https://commons.wikimedia.org/wiki/File:Henry_Joseph_Redout%C3%A9_-_Les_Roses-_Rosa_Damascena,_subalba_-_1965.291_-_Cleveland_Museum_of_Art.jpg" target="_blank" rel="noopener noreferrer">
            Wikimedia Commons
          </a>
          .
        </p>
      </div>
      <nav className="foot__tile foot__nav" aria-label="Footer" data-enter>
        <Link to="/shop">Shop all</Link>
        {categories.map((c) => (
          <Link key={c.id} to={`/shop/${c.path}`}>{c.name}</Link>
        ))}
        <Link to="/wishlist">Wishlist</Link>
      </nav>
      <div className="foot__tile foot__wa" data-enter>
        <p>Orders and questions on WhatsApp</p>
        <a href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer" className="foot__big" dir="ltr">
          {SITE.phoneDisplay}
        </a>
      </div>
      <div className="foot__tile foot__mail" data-enter>
        <p>Email</p>
        <a href={`mailto:${SITE.email}`} className="foot__big foot__email">{SITE.email}</a>
      </div>
      <div className="foot__tile foot__mark" data-enter>
        <span className="foot__word">Atyab</span>
        <span className="foot__word-ar" lang="ar" dir="rtl">أطياب</span>
      </div>
      <Link to="/shop" className="foot__tile foot__go" data-enter>
        <span className="foot__go-text">See all nineteen</span>
        <span className="foot__arrow"><Icon name="arrow" size={56} /></span>
      </Link>
    </footer>
  );
}
