import { Link } from 'react-router';
import { Img } from '../components/Img';
import { categories, inCategory } from '../data/catalog';
import { useLang } from '../i18n/lang';

/** The five families, each in an arched frame like the windows in the house photographs. */
export function Collections() {
  const { ar, t } = useLang();
  return (
    <section className="collections" data-section aria-labelledby="collections-title">
      <header className="section-head" data-enter>
        <p className="eyebrow">{t.collectionsEyebrow}</p>
        <h2 id="collections-title" className="title">{t.collectionsTitle}</h2>
      </header>
      <ul className="collections__row">
        {categories.map((c) => {
          const n = inCategory(c.id).length;
          return (
            <li key={c.id} data-enter>
              <Link to={`/shop/${c.path}`} className="collection">
                <span className="collection__arch">
                  <Img name={c.image} alt="" sizes="(min-width: 64em) 18vw, 40vw" />
                </span>
                <span className="collection__ar" lang={ar ? 'en' : 'ar'} dir="auto">{ar ? c.name : c.nameAr}</span>
                <span className="collection__name">{ar ? c.nameAr : c.name}</span>
                <span className="collection__count">{t.pieces(n)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
