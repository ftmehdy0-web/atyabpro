import { memo } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/types';
import { formatPrice } from '../lib/site';
import { useCartActions } from '../state/cart';
import { Img } from './Img';
import { ProductImage } from './ProductImage';
import { WishButton } from './WishButton';

const SIZES = '(min-width: 64em) 25vw, (min-width: 40em) 33vw, 50vw';

/** A shop card: square photograph (a detail shot fades in on hover), the name, the price, one action. */
export const ProductTile = memo(function ProductTile({ product: p }: { product: Product }) {
  const { add } = useCartActions();
  const detail = p.image ? p.gallery[1] ?? p.gallery[0] : undefined;
  return (
    <article className="card">
      <div className="card__media">
        <Link to={`/product/${p.slug}`} className="card__pic" tabIndex={-1} aria-hidden="true">
          <ProductImage product={p} alt="" sizes={SIZES} />
          {detail && <Img name={detail} alt="" sizes={SIZES} className="card__alt" />}
        </Link>
        <WishButton id={p.id} name={p.name} className="card__wish" />
      </div>
      <div className="card__body">
        <p className="card__type">{p.type}</p>
        <h3 className="card__name">
          <Link to={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="card__price nums">{p.sizes ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}</p>
        {p.sizes ? (
          <Link to={`/product/${p.slug}`} className="button button--line card__add">Choose size</Link>
        ) : (
          <button type="button" className="button button--line card__add" onClick={() => add(p.id)}>
            Add to bag<span className="sr-only">, {p.name}</span>
          </button>
        )}
      </div>
    </article>
  );
});
