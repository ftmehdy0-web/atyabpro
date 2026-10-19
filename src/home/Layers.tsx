import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { Icon } from '../components/Icon';
import { ProductImage } from '../components/ProductImage';
import { getCategory, inCategory, layers } from '../data/catalog';
import type { Product } from '../data/types';
import { formatPrice } from '../lib/site';
import { gsap, MOTION, useGSAP } from '../lib/gsap';
import { useCartActions } from '../state/cart';

// The set it opens with: one of each layer, and not the bottle the page has already shown twice.
const OPENING = ['backhoor', 'cream-bin-shaikh', 'dehn-al-oud-Signature', 'mashair'];

// Only products sold at one price can go into the set; sized products need a size first.
const options = layers.map((l) =>
  inCategory(l.category)
    .filter((p) => !p.sizes)
    .sort((a, b) => Number(!a.image) - Number(!b.image)),
);

/**
 * The live thing: wear-order tiles that grow from the smoke to the perfume.
 * The visitor picks one piece for each layer and sees the real total for the set.
 */
export function Layers() {
  const root = useRef<HTMLElement>(null);
  const [picks, setPicks] = useState<number[]>(() =>
    options.map((opts, l) => Math.max(0, opts.findIndex((p) => p.slug === OPENING[l]))),
  );
  const [added, setAdded] = useState(false);
  const { add } = useCartActions();

  const chosen: Product[] = picks.map((i, layer) => options[layer][i]);
  const total = chosen.reduce((sum, p) => sum + p.price, 0);

  function step(layer: number, by: number) {
    setAdded(false);
    setPicks((cur) => cur.map((i, l) => (l === layer ? (i + by + options[l].length) % options[l].length : i)));
  }

  function addAll() {
    for (const p of chosen) add(p.id);
    setAdded(true);
  }

  // Tiles rise into place one after another, smallest first, so the growth reads as order.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        gsap.from('.layers__tile', {
          yPercent: 12,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.09,
          scrollTrigger: { trigger: '.layers__row', start: 'top 85%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="layers" ref={root} data-section aria-labelledby="layers-title">
      <div className="layers__head" data-enter>
        <h2 id="layers-title" className="h2">Wear it in four layers</h2>
        <p className="layers__lead">
          Ṭīb is Arabic for a scent. Atyab is its plural. Choose one piece for each layer and see what the set costs.
        </p>
      </div>

      <ol className="layers__row">
        {layers.map((l, i) => {
          const p = chosen[i];
          const many = options[i].length > 1;
          return (
            <li key={l.category} className={`layers__stage layers__stage--${i}`}>
              <div className={`layers__tile tone-${i}`}>
                <Link to={`/product/${p.slug}`} className="layers__pic">
                  <ProductImage key={p.id} product={p} alt={p.name} sizes="(min-width: 64em) 33vw, 100vw" />
                </Link>
              </div>
              <h3 className="layers__name">{l.title}</h3>
              <p className="layers__line">{l.line}</p>
              <div className="picker" role="group" aria-label={`${getCategory(l.category).name} for the set`}>
                {many && (
                  <button type="button" className="picker__btn" onClick={() => step(i, -1)} aria-label={`Previous ${getCategory(l.category).name.toLowerCase()}`}>
                    <Icon name="prev" size={18} />
                  </button>
                )}
                <p className="picker__value" aria-live="polite">
                  <span className="picker__name">{p.name}</span>
                  <span className="picker__price nums">{formatPrice(p.price)}</span>
                </p>
                {many && (
                  <button type="button" className="picker__btn" onClick={() => step(i, 1)} aria-label={`Next ${getCategory(l.category).name.toLowerCase()}`}>
                    <Icon name="next" size={18} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="layers__total" data-enter>
        <p className="layers__sum">
          Your four layers <span className="nums">{formatPrice(total)}</span>
        </p>
        <button type="button" className="button" onClick={addAll}>
          Add all four to bag
        </button>
        <p className="layers__done" aria-live="polite">{added ? 'All four are in your bag.' : ''}</p>
      </div>
    </section>
  );
}
