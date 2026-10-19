import { Link } from 'react-router';
import { Img } from '../components/Img';
import { categories, inCategory } from '../data/catalog';

/** The five families, each in an arched frame like the windows in the house photographs. */
export function Collections() {
  return (
    <section className="collections" data-section aria-labelledby="collections-title">
      <header className="section-head" data-enter>
        <p className="eyebrow">Shop by family</p>
        <h2 id="collections-title" className="title">Cherished collections</h2>
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
                <span className="collection__ar" lang="ar" dir="rtl">{c.nameAr}</span>
                <span className="collection__name">{c.name}</span>
                <span className="collection__count">{n} {n === 1 ? 'piece' : 'pieces'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
