import { useDeferredValue, useMemo, useRef } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router';
import { Icon } from '../components/Icon';
import { ProductTile } from '../components/ProductTile';
import { Suggestions } from '../components/Suggestions';
import { categories, genders, getCategoryByPath, products } from '../data/catalog';
import type { Gender, Product } from '../data/types';
import { genderName, localize, pick, useLang, type Lang } from '../i18n/lang';
import { enterSections, useGSAP } from '../lib/gsap';
import { useSeo } from '../lib/useSeo';
import NotFound from './NotFound';

const sorts = {
  featured: null,
  'price-asc': (a: Product, b: Product) => a.price - b.price,
  'price-desc': (a: Product, b: Product) => b.price - a.price,
  name: 'name',
} as const;
type SortKey = keyof typeof sorts;

const isSort = (v: string | null): v is SortKey => !!v && v in sorts;
const byName = (lang: Lang) => (a: Product, b: Product) =>
  localize(a, lang).name.localeCompare(localize(b, lang).name, lang);

const isGender = (v: string | null): v is Gender => genders.some((g) => g.id === v);

/** Searches both languages, so an Arabic note finds an English page and the other way round. */
function matches(p: Product, q: string) {
  if (!q) return true;
  const a = localize(p, 'ar');
  const notes = (n: Product['notes']) => `${n.top.join(' ')} ${n.heart.join(' ')} ${n.base.join(' ')}`;
  const hay = `${p.name} ${p.nameAr} ${p.accord} ${p.type} ${notes(p.notes)} ${a.name} ${a.accord} ${a.type} ${notes(a.notes)}`.toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export default function Shop() {
  const { category: path } = useParams();
  const [params, setParams] = useSearchParams();
  const root = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();
  const s = t.shop;
  const category = path ? getCategoryByPath(path) : undefined;

  const q = params.get('q') ?? '';
  const deferredQ = useDeferredValue(q.trim().toLowerCase());
  const gender = isGender(params.get('for')) ? (params.get('for') as Gender) : null;
  const sort: SortKey = isSort(params.get('sort')) ? (params.get('sort') as SortKey) : 'featured';

  const list = useMemo(() => {
    const out = products.filter(
      (p) => (!category || p.category === category.id) && (!gender || p.gender === gender) && matches(p, deferredQ),
    );
    const fn = sorts[sort];
    if (!fn) return out;
    if (fn === 'name') return [...out].sort(byName(lang));
    return [...out].sort(fn);
  }, [category, gender, sort, deferredQ, lang]);

  const catName = category ? pick(lang, category) : '';
  const catLine = category ? (lang === 'ar' ? category.lineAr : category.line) : '';
  useSeo(category ? catName : t.seo.shopAll, category ? t.seo.category(catName, catLine) : t.seo.shopAllDesc);

  // Entrances once per page; filtering afterwards should feel instant, not replay.
  useGSAP(() => { enterSections(root.current!); }, { scope: root, dependencies: [path] });

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }

  if (path && !category) return <NotFound />;

  const filtered = Boolean(q || gender);

  return (
    <div className="shop" ref={root}>
      <header className="shop__head" data-section>
        <h1 className="shop__title" data-enter>{category ? catName : s.allTitle}</h1>
        <p className="shop__line" data-enter>
          {category ? catLine : s.allLine}
        </p>
      </header>

      <div className="filters" role="search">
        <nav className="filters__cats" aria-label={s.families}>
          <NavLink to={{ pathname: '/shop', search: params.toString() }} end className="chip">{s.all}</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={{ pathname: `/shop/${c.path}`, search: params.toString() }} className="chip">
              {pick(lang, c)}
            </NavLink>
          ))}
        </nav>
        <div className="filters__row">
          <label className="search">
            <span className="sr-only">{s.searchLabel}</span>
            <Icon name="search" size={20} />
            <input
              type="search"
              name="q"
              value={q}
              onChange={(e) => update('q', e.target.value)}
              placeholder={s.placeholder}
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
          <div className="filters__for" role="group" aria-label={s.whoFor}>
            {genders.map((g) => (
              <button
                key={g.id}
                type="button"
                className="chip"
                aria-pressed={gender === g.id}
                onClick={() => update('for', gender === g.id ? null : g.id)}
              >
                {genderName(lang, g.id, g.name)}
              </button>
            ))}
          </div>
          <label className="sort">
            <span>{s.sort}</span>
            <select value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? null : e.target.value)}>
              {(Object.keys(sorts) as SortKey[]).map((k) => (
                <option key={k} value={k}>{s.sorts[k]}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="filters__count" aria-live="polite">
          {t.pieces(list.length)}
          {filtered && (
            <>
              {' · '}
              <button type="button" className="text-button" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>
                {s.clear}
              </button>
            </>
          )}
        </p>
      </div>

      {list.length > 0 && (
        <div className="specs" data-section>
          <h2 className="sr-only">{category ? catName : s.allPieces}</h2>
          {list.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      )}
      {list.length > 0 && list.length < 4 && !filtered && <Suggestions title={s.more} />}
      {list.length === 0 && (
        <div className="empty">
          <h2 className="h2">{s.nothing}</h2>
          <p>
            {s.tryAnother(<button type="button" className="text-button" onClick={() => setParams({}, { replace: true })}>{s.clearLower}</button>)}
          </p>
          <Suggestions title={s.orStart} />
        </div>
      )}
    </div>
  );
}
