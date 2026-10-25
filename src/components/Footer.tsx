import { useRef } from 'react';
import { Link } from 'react-router';
import { categories } from '../data/catalog';
import { pick, useLang } from '../i18n/lang';
import { enterSections, useGSAP } from '../lib/gsap';
import { SITE, whatsappLink } from '../lib/site';
import { Newsletter } from './Newsletter';

const base = import.meta.env.BASE_URL;

export function Footer() {
  const { lang, t } = useLang();
  const year = new Date().getFullYear();
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { enterSections(root.current!); }, { scope: root });
  return (
    <footer className="foot" ref={root} data-section>
      <h2 className="sr-only">{t.footer.about}</h2>
      <div className="foot__brand" data-enter>
        <img src={`${base}images/atyab_logo-192.webp`} width={72} height={72} alt="" />
        <p className="foot__word" lang="en">Atyab</p>
        <p className="foot__ar" lang="ar" dir="rtl">أطياب</p>
        <p className="foot__sentence">{t.footer.sentence}</p>
      </div>

      <div className="foot__cols">
        <nav className="foot__col" aria-label={t.collections} data-enter>
          <h3 className="foot__head">{t.footer.shop}</h3>
          <Link to="/shop">{t.shopAll}</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.path}`}>{pick(lang, c)}</Link>
          ))}
        </nav>
        <nav className="foot__col" aria-label={t.footer.account} data-enter>
          <h3 className="foot__head">{t.footer.yourOrder}</h3>
          <Link to="/bag">{t.bag}</Link>
          <Link to="/wishlist">{t.wishlist}</Link>
          <Link to="/account">{t.accountLabel}</Link>
          <a href={whatsappLink(t.helloOrder)} target="_blank" rel="noopener noreferrer">{t.footer.orderOnWa}</a>
        </nav>
        <div className="foot__col" data-enter>
          <h3 className="foot__head">{t.footer.contact}</h3>
          <a href={whatsappLink(t.hello)} target="_blank" rel="noopener noreferrer" dir="ltr">{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`} className="foot__email" dir="ltr">{SITE.email}</a>
        </div>
        <div className="foot__col foot__news" data-enter>
          <h3 className="foot__head">{t.footer.news}</h3>
          <Newsletter />
        </div>
      </div>

      <div className="foot__legal">
        <p>{t.footer.legal(year)}</p>
        <p>
          {t.footer.rose}{' '}
          <a className="link-plain" href="https://commons.wikimedia.org/wiki/File:Henry_Joseph_Redout%C3%A9_-_Les_Roses-_Rosa_Damascena,_subalba_-_1965.291_-_Cleveland_Museum_of_Art.jpg" target="_blank" rel="noopener noreferrer">
            Wikimedia Commons
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
