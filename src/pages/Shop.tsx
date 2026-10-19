import { useDeferredValue, useMemo, useRef } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router';
import { Icon } from '../components/Icon';
import { ProductTile } from '../components/ProductTile';
import { Suggestions } from '../components/Suggestions';
import { categories, genders, getCategoryByPath, products } from '../data/catalog';
import type { Gender, Product } from '../data/types';
import { enterSections, useGSAP } from '../lib/gsap';
import { useSeo } from '../lib/useSeo';
import NotFound from './NotFound';

const sorts = {
  featured: { label: 'House order', fn: null },
  'price-asc': { label: 'Price, low to high', fn: (a: Product, b: Product) => a.price - b.price },
  'price-desc': { label: 'Price, high to low', fn: (a: Product, b: Product) => b.price - a.price },
  name: { label: 'Name, A to Z', fn: (a: Product, b: Product) => a.name.localeCompare(b.name) },
} as const;
type SortKey = keyof typeof sorts;

const isSort = (v: string | null): v is SortKey => !!v && v in sorts;
const isGender = (v: string | null): v is Gender => genders.some((g) => g.id === v);

function matches(p: Product, q: string) {
  if (!q) return true;
  const hay = `${p.name} ${p.nameAr} ${p.accord} ${p.type} ${p.notes.top.join(' ')} ${p.notes.heart.join(' ')} ${p.notes.base.join(' ')}`.toLowerCase();
  return q.split(/\s+/).every((word) => hay.includes(word));
}

export default function Shop() {
  const { category: path } = useParams();
  const [params, setParams] = useSearchParams();
  const root = useRef<HTMLDivElement>(null);
  const category = path ? getCategoryByPath(path) : undefined;

  const q = params.get('q') ?? '';
  const deferredQ = useDeferredValue(q.trim().toLowerCase());
  const gender = isGender(params.get('for')) ? (params.get('for') as Gender) : null;
  const sort: SortKey = isSort(params.get('sort')) ? (params.get('sort') as SortKey) : 'featured';

  const list = useMemo(() => {
    const out = products.filter(
      (p) => (!category || p.category === category.id) && (!gender || p.gender === gender) && matches(p, deferredQ),
    );
    const fn = sorts[sort].fn;
    return fn ? [...out].sort(fn) : out;
  }, [category, gender, sort, deferredQ]);

  useSeo(
    category ? category.name : 'Shop all',
    category ? `${category.name} from Atyab Perfumes. ${category.line}` : 'All nineteen Atyab pieces: perfumes, oils, bakhoor, body creams and gift sets, with prices in SAR.',
  );

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
        <h1 className="shop__title" data-enter>{category ? category.name : 'The whole house'}</h1>
        <p className="shop__line" data-enter>
          {category ? category.line : 'Every Atyab piece: perfumes, oils, bakhoor, body creams and gift sets, priced in Saudi riyals.'}
        </p>
      </header>

      <div className="filters" role="search">
        <nav className="filters__cats" aria-label="Families">
          <NavLink to={{ pathname: '/shop', search: params.toString() }} end className="chip">All</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={{ pathname: `/shop/${c.path}`, search: params.toString() }} className="chip">
              {c.name}
            </NavLink>
          ))}
        </nav>
        <div className="filters__row">
          <label className="search">
            <span className="sr-only">Search by name or note</span>
            <Icon name="search" size={20} />
            <input
              type="search"
              name="q"
              value={q}
              onChange={(e) => update('q', e.target.value)}
              placeholder="Search a name or a note, like saffron"
              autoComplete="off"
              enterKeyHint="search"
            />
          </label>
          <div className="filters__for" role="group" aria-label="Who it is for">
            {genders.map((g) => (
              <button
                key={g.id}
                type="button"
                className="chip"
                aria-pressed={gender === g.id}
                onClick={() => update('for', gender === g.id ? null : g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
          <label className="sort">
            <span>Sort</span>
            <select value={sort} onChange={(e) => update('sort', e.target.value === 'featured' ? null : e.target.value)}>
              {Object.entries(sorts).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="filters__count" aria-live="polite">
          {list.length} {list.length === 1 ? 'piece' : 'pieces'}
          {filtered && (
            <>
              {' · '}
              <button type="button" className="text-button" onClick={() => setParams({}, { replace: true, preventScrollReset: true })}>
                Clear filters
              </button>
            </>
          )}
        </p>
      </div>

      {list.length > 0 && (
        <div className="specs" data-section>
          <h2 className="sr-only">{category ? category.name : 'All pieces'}</h2>
          {list.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      )}
      {list.length > 0 && list.length < 4 && !filtered && <Suggestions title="More from the house" />}
      {list.length === 0 && (
        <div className="empty">
          <h2 className="h2">Nothing matches that</h2>
          <p>
            Try another note, or{' '}
            <button type="button" className="text-button" onClick={() => setParams({}, { replace: true })}>clear the filters</button>
            {' '}to see every piece.
          </p>
          <Suggestions title="Or start with these" />
        </div>
      )}
    </div>
  );
}
