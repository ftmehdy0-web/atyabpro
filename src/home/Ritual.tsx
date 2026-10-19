import { Link } from 'react-router';
import { getCategory, layers } from '../data/catalog';
import { useLang } from '../i18n/lang';

const base = import.meta.env.BASE_URL;
const numerals = { en: ['I', 'II', 'III', 'IV'], ar: ['١', '٢', '٣', '٤'] };

/** Why the name is plural: the four scents worn together, in order. */
export function Ritual() {
  const { ar, lang, t } = useLang();
  return (
    <section className="ritual" data-section aria-labelledby="ritual-title">
      <img className="ritual__mark" src={`${base}images/atyab_logo-192.webp`} width={88} height={88} alt="" data-enter />
      <p className="eyebrow" data-enter>{t.ritual.eyebrow}</p>
      <h2 id="ritual-title" className="ritual__title" data-enter>
        {t.ritual.title}
      </h2>
      <ol className="ritual__steps">
        {layers.map((l, i) => {
          const c = getCategory(l.category);
          return (
            <li key={l.category} className="ritual__step" data-enter>
              <span className="ritual__num" aria-hidden="true">{numerals[lang][i]}</span>
              <h3 className="ritual__name">{ar ? l.titleAr : l.title}</h3>
              <p>{ar ? l.lineAr : l.line}</p>
              <Link to={`/shop/${c.path}`} className="text-button">{t.ritual.shop(ar ? c.nameAr : c.name)}</Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
