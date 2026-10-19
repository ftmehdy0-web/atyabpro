import { Link } from 'react-router';
import { Img } from '../components/Img';
import { getProduct } from '../data/catalog';
import { useLang, useProductText } from '../i18n/lang';
import { useCartActions } from '../state/cart';

const gift = getProduct('Signature-kings-gift-set')!;

/** The gift box beside what is inside it. */
export function Gifting() {
  const { add } = useCartActions();
  const { t, price } = useLang();
  const text = useProductText(gift);
  return (
    <section className="gifting" data-section aria-labelledby="gifting-title">
      <div className="gifting__pic" data-enter>
        <Img name={gift.image!} alt={t.gifting.alt(text.name)} sizes="(min-width: 56em) 50vw, 100vw" />
      </div>
      <div className="gifting__text">
        <p className="eyebrow eyebrow--light" data-enter>{t.gifting.eyebrow}</p>
        <h2 id="gifting-title" className="gifting__title" data-enter>{t.gifting.title}</h2>
        <p className="gifting__line" data-enter>{t.gifting.line}</p>
        <p className="gifting__price nums" data-enter>{price(gift.price)}</p>
        <div className="gifting__actions" data-enter>
          <button type="button" className="button" onClick={() => add(gift.id)}>{t.card.addToBag}</button>
          <Link to={`/product/${gift.slug}`} className="button button--ghost-light">{t.gifting.see}</Link>
        </div>
      </div>
    </section>
  );
}
