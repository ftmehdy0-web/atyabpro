import { useRef } from 'react';
import { Link } from 'react-router';
import { categories } from '../data/catalog';
import { enterSections, useGSAP } from '../lib/gsap';
import { SITE, whatsappLink } from '../lib/site';
import { Newsletter } from './Newsletter';

const base = import.meta.env.BASE_URL;

export function Footer() {
  const year = new Date().getFullYear();
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { enterSections(root.current!); }, { scope: root });
  return (
    <footer className="foot" ref={root} data-section>
      <h2 className="sr-only">About Atyab Perfumes</h2>
      <div className="foot__brand" data-enter>
        <img src={`${base}images/atyab_logo-192.webp`} width={72} height={72} alt="" />
        <p className="foot__word">Atyab</p>
        <p className="foot__ar" lang="ar" dir="rtl">أطياب</p>
        <p className="foot__sentence">One scent is a ṭīb. Worn together, they are atyab.</p>
      </div>

      <div className="foot__cols">
        <nav className="foot__col" aria-label="Collections" data-enter>
          <h3 className="foot__head">Shop</h3>
          <Link to="/shop">Shop all</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.path}`}>{c.name}</Link>
          ))}
        </nav>
        <nav className="foot__col" aria-label="Your account" data-enter>
          <h3 className="foot__head">Your order</h3>
          <Link to="/bag">Bag</Link>
          <Link to="/wishlist">Wishlist</Link>
          <a href={whatsappLink('Hello Atyab, I would like to place an order.')} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
        </nav>
        <div className="foot__col" data-enter>
          <h3 className="foot__head">Contact</h3>
          <a href={whatsappLink('Hello Atyab, I have a question.')} target="_blank" rel="noopener noreferrer" dir="ltr">{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`} className="foot__email">{SITE.email}</a>
        </div>
        <div className="foot__col foot__news" data-enter>
          <h3 className="foot__head">New arrivals by email</h3>
          <Newsletter />
        </div>
      </div>

      <div className="foot__legal">
        <p>© {year} {SITE.name}. Prices in Saudi riyals. No payment is taken on this site.</p>
        <p>
          Rose plate: “Les Roses: Rosa Damascena, subalba” by Henry Joseph Redouté, CC0, via{' '}
          <a className="link-plain" href="https://commons.wikimedia.org/wiki/File:Henry_Joseph_Redout%C3%A9_-_Les_Roses-_Rosa_Damascena,_subalba_-_1965.291_-_Cleveland_Museum_of_Art.jpg" target="_blank" rel="noopener noreferrer">
            Wikimedia Commons
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
