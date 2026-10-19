import { Link } from 'react-router';
import { ProductImage } from '../components/ProductImage';
import { categories, inCategory } from '../data/catalog';
import { formatPrice } from '../lib/site';

/** The whole catalogue on one sheet: each family, each piece, each price. */
export function PriceSheet() {
  return (
    <section className="sheet-list" data-section aria-labelledby="sheet-title">
      <div className="sheet-list__head" data-enter>
        <h2 id="sheet-title" className="h2">Every price, one page</h2>
        <nav className="sheet-list__jump" aria-label="Jump to a family">
          {categories.map((c) => (
            <a key={c.id} href={`#family-${c.path}`} className="link">{c.name}</a>
          ))}
        </nav>
      </div>
      {categories.map((c) => {
        const items = inCategory(c.id);
        return (
          <div key={c.id} id={`family-${c.path}`} className="family" data-section>
            <div className="family__head" data-enter>
              <h3 className="family__name">
                <Link to={`/shop/${c.path}`}>{c.name}</Link>
              </h3>
              <p className="family__count">
                {items.length} {items.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            <ul className="family__items">
              {items.map((p) => (
                <li key={p.id} className="item" data-enter>
                  <Link to={`/product/${p.slug}`} className="item__link">
                    <ProductImage product={p} alt="" sizes="64px" className="item__pic" />
                    <span className="item__body">
                      <span className="item__top">
                        <span className="item__name">{p.name}</span>
                        <span className="item__price nums">{p.sizes ? `from ${formatPrice(p.price)}` : formatPrice(p.price)}</span>
                      </span>
                      <span className="item__desc">{p.accord}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
