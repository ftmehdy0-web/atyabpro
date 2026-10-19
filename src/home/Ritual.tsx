import { Link } from 'react-router';
import { getCategory, layers } from '../data/catalog';

const base = import.meta.env.BASE_URL;
const numerals = ['I', 'II', 'III', 'IV'];

/** Why the name is plural: the four scents worn together, in order. */
export function Ritual() {
  return (
    <section className="ritual" data-section aria-labelledby="ritual-title">
      <img className="ritual__mark" src={`${base}images/atyab_logo-192.webp`} width={88} height={88} alt="" data-enter />
      <p className="eyebrow" data-enter>The Arabian ritual</p>
      <h2 id="ritual-title" className="ritual__title" data-enter>
        One scent is a <em>ṭīb</em>. Worn together, they are <em>atyab</em>.
      </h2>
      <ol className="ritual__steps">
        {layers.map((l, i) => {
          const c = getCategory(l.category);
          return (
            <li key={l.category} className="ritual__step" data-enter>
              <span className="ritual__num" aria-hidden="true">{numerals[i]}</span>
              <h3 className="ritual__name">{l.title}</h3>
              <p>{l.line}</p>
              <Link to={`/shop/${c.path}`} className="text-button">Shop {c.name.toLowerCase()}</Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
