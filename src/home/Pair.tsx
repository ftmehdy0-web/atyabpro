import { useRef } from 'react';
import { Link } from 'react-router';
import { ProductImage } from '../components/ProductImage';
import { getProduct } from '../data/catalog';
import { formatPrice } from '../lib/site';
import { gsap, MOTION, useGSAP } from '../lib/gsap';
import { useCartActions } from '../state/cart';

const pair = [
  { product: getProduct('tiger-oud')!, tone: 'light' },
  { product: getProduct('nader')!, tone: 'dark' },
];

/** Two objects, two fields: the house's two signature bottles, very close. */
export function Pair() {
  const root = useRef<HTMLElement>(null);
  const { add } = useCartActions();

  // The one moving picture: each bottle drifts up through its panel as the page scrolls.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        gsap.utils.toArray<HTMLElement>('.pair__pic', root.current).forEach((pic) => {
          gsap.fromTo(pic, { yPercent: 6 }, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: pic.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="pair" ref={root} data-section aria-labelledby="pair-title">
      {pair.map(({ product: p, tone }, i) => (
        <div key={p.id} className={`pair__panel pair__panel--${tone}`}>
          {i === 0 && <h2 id="pair-title" className="pair__title" data-enter>The house pair</h2>}
          <div className="pair__frame">
            <ProductImage product={p} alt={`${p.name} bottle${p.id === 'atyab-tiger-oud' ? ' beside its marble-white box' : ' with its gold box'}`} sizes="(min-width: 48em) 50vw, 100vw" className="pair__pic" />
          </div>
          <div className="pair__row" data-enter>
            <div>
              <h3 className="pair__name">{p.name}</h3>
              <p className="pair__fact"><span className="nums">{formatPrice(p.price)}</span> · {p.accord}</p>
            </div>
            <div className="pair__actions">
              <button type="button" className={`button ${tone === 'light' ? 'button--ink' : 'button--paper'}`} onClick={() => add(p.id)}>
                Add to bag<span className="sr-only">, {p.name}</span>
              </button>
              <Link to={`/product/${p.slug}`} className={`button ${tone === 'light' ? 'button--paper' : 'button--quiet-dark'}`}>
                Details<span className="sr-only"> of {p.name}</span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
