import { Link } from 'react-router';
import { Img } from '../components/Img';
import { getProduct } from '../data/catalog';
import { formatPrice } from '../lib/site';
import { useCartActions } from '../state/cart';

const gift = getProduct('Signature-kings-gift-set')!;

/** The gift box beside what is inside it. */
export function Gifting() {
  const { add } = useCartActions();
  return (
    <section className="gifting" data-section aria-labelledby="gifting-title">
      <div className="gifting__pic" data-enter>
        <Img name={gift.image!} alt={`${gift.name}, open to show the bottles inside`} sizes="(min-width: 56em) 50vw, 100vw" />
      </div>
      <div className="gifting__text">
        <p className="eyebrow eyebrow--light" data-enter>The art of gifting</p>
        <h2 id="gifting-title" className="gifting__title" data-enter>A box for the highest esteem</h2>
        <p className="gifting__line" data-enter>
          Gold-stamped leather lined in velvet, holding a 110 ml Tiger Oud, a crystal tola of aged agarwood attar,
          Signature Bakhoor and a gilded crystal burner, with a calligraphy greeting card.
        </p>
        <p className="gifting__price nums" data-enter>{formatPrice(gift.price)}</p>
        <div className="gifting__actions" data-enter>
          <button type="button" className="button" onClick={() => add(gift.id)}>Add to bag</button>
          <Link to={`/product/${gift.slug}`} className="button button--ghost-light">See the box</Link>
        </div>
      </div>
    </section>
  );
}
