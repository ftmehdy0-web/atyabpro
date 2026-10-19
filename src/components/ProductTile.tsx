import { memo } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/types';
import { useLang, useProductText } from '../i18n/lang';
import { useCartActions } from '../state/cart';
import { Img } from './Img';
import { ProductImage } from './ProductImage';
import { WishButton } from './WishButton';

const SIZES = '(min-width: 64em) 25vw, (min-width: 40em) 33vw, 50vw';

/** A shop card: square photograph (a detail shot fades in on hover), the name, the price, one action. */
export const ProductTile = memo(function ProductTile({ product: p }: { product: Product }) {
  const { add } = useCartActions();
  const { t, price } = useLang();
  const text = useProductText(p);
  const detail = p.image ? p.gallery[1] ?? p.gallery[0] : undefined;
  return (
    <article className="card">
      <div className="card__media">
        <Link to={`/product/${p.slug}`} className="card__pic" tabIndex={-1} aria-hidden="true">
          <ProductImage product={p} alt="" sizes={SIZES} />
          {detail && <Img name={detail} alt="" sizes={SIZES} className="card__alt" />}
        </Link>
        <WishButton id={p.id} name={text.name} className="card__wish" />
      </div>
      <div className="card__body">
        <p className="card__type">{text.type}</p>
        <h3 className="card__name">
          <Link to={`/product/${p.slug}`}>{text.name}</Link>
        </h3>
        <p className="card__price nums">{p.sizes ? t.card.from(price(p.price)) : price(p.price)}</p>
        {p.sizes ? (
          <Link to={`/product/${p.slug}`} className="button button--line card__add">{t.card.chooseSize}</Link>
        ) : (
          <button type="button" className="button button--line card__add" onClick={() => add(p.id)}>
            {t.card.addToBag}<span className="sr-only">, {text.name}</span>
          </button>
        )}
      </div>
    </article>
  );
});
