import { memo } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/types';
import { formatPrice } from '../lib/site';
import { useCartActions } from '../state/cart';
import { ProductImage } from './ProductImage';
import { WishButton } from './WishButton';

interface Props {
  product: Product;
  /** Field colour, cycled by the parent grid. */
  tone: number;
  large?: boolean;
}

/** A catalogue specimen: the photograph on its tile, the name and one fact beneath. */
export const ProductTile = memo(function ProductTile({ product: p, tone, large = false }: Props) {
  const { add } = useCartActions();
  return (
    <article className={`spec${large ? ' spec--large' : ''}`} data-enter>
      <div className={`spec__tile tone-${tone}`}>
        <Link to={`/product/${p.slug}`} className="spec__pic">
          <ProductImage product={p} alt={p.name} sizes={large ? '(min-width: 64em) 50vw, 100vw' : '(min-width: 64em) 25vw, (min-width: 40em) 33vw, 50vw'} />
        </Link>
        <WishButton id={p.id} name={p.name} className="spec__wish" />
      </div>
      <div className="spec__text">
        <h3 className="spec__name">
          <Link to={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="spec__fact">{p.accord}</p>
        <div className="spec__buy">
          <span className="spec__price nums">{p.sizes ? `From ${formatPrice(p.price)}` : formatPrice(p.price)}</span>
          {p.sizes ? (
            <Link to={`/product/${p.slug}`} className="text-button">Choose size</Link>
          ) : (
            <button type="button" className="text-button" onClick={() => add(p.id)}>
              Add to bag<span className="sr-only">, {p.name}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
});
