import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { ProductImage } from '../components/ProductImage';
import { inCategory, lowestPrice, shortName } from '../data/catalog';
import { formatPrice } from '../lib/site';
import { gsap, MOTION, useGSAP } from '../lib/gsap';
import { useCartActions } from '../state/cart';

const perfumes = inCategory('perfume');
const TONES = 4;

/**
 * The first screen: the house name, one specimen on its tile, and the list of
 * perfumes beside it. Choosing a name swaps the specimen, its tile colour and its facts.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const shown = useRef(index);
  const { add } = useCartActions();
  const p = perfumes[index];

  // Load sequence: the title rises from its mask, the tile opens, the rest arrives. Settled by 1.2s.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        gsap.timeline({ defaults: { ease: 'expo.out' } })
          .from('[data-line]', { yPercent: 105, duration: 0.9, stagger: 0.09 }, 0.1)
          .from('.hero__tile', { clipPath: 'inset(100% 0 0 0)', duration: 1, ease: 'power4.inOut' }, 0.15)
          .from('.hero__tile img', { scale: 1.12, duration: 1.1 }, 0.1)
          .from('[data-load]', { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 0.42);
      });
    },
    { scope: root },
  );

  // Each swap: the new photograph settles in and the facts rise; under reduced motion it only fades.
  useGSAP(
    () => {
      if (shown.current === index) return;
      shown.current = index;
      const mm = gsap.matchMedia();
      mm.add(MOTION.full, () => {
        gsap.fromTo('.hero__tile img', { scale: 1.06, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, duration: 0.9 });
        gsap.fromTo('.hero__facts > *', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
      });
      mm.add(MOTION.reduced, () => {
        gsap.fromTo('.hero__tile img', { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 0.3 });
      });
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  function choose(i: number) {
    const next = (i + perfumes.length) % perfumes.length;
    setIndex(next);
    listRef.current?.querySelectorAll('button')[next]?.focus({ preventScroll: true });
    listRef.current?.querySelectorAll('button')[next]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); choose(index + 1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); choose(index - 1); }
  }

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__head">
        <h1 id="hero-title" className="hero__title lines">
          <span className="line"><span data-line>Atyab Perfumes</span></span>
        </h1>
        <p className="hero__intro" data-load>
          Oud perfumes, dehn al oud, bakhoor and perfumed body creams. Nineteen pieces, from {formatPrice(lowestPrice)}.
        </p>
      </div>

      <div className="hero__stage">
        <div className="hero__names">
          <p className="hero__names-label" id="hero-names">Choose a perfume</p>
          <ul ref={listRef} className="hero__list" aria-labelledby="hero-names" onKeyDown={onKey}>
            {perfumes.map((x, i) => {
              const d = Math.min(Math.abs(i - index), 4);
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    className={`hero__name d-${d}`}
                    aria-pressed={i === index}
                    tabIndex={i === index ? 0 : -1}
                    onClick={() => choose(i)}
                  >
                    {shortName(x)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <figure className={`hero__tile tone-${index % TONES}`}>
          <ProductImage key={p.id} product={p} alt={`${p.name}, ${p.type}`} sizes="(min-width: 64em) 33vw, 100vw" priority />
        </figure>

        <div className="hero__facts" aria-live="polite">
          <p className="hero__ar" lang="ar" dir="rtl">{p.nameAr}</p>
          <h2 className="hero__pname">{p.name}</h2>
          <p className="hero__accord">{p.accord}</p>
          <p className="hero__price nums">{formatPrice(p.price)}</p>
          <div className="hero__actions">
            <button type="button" className="button" onClick={() => add(p.id)}>
              Add to bag<span className="sr-only">, {p.name}</span>
            </button>
            <Link to={`/product/${p.slug}`} className="button button--quiet">See the notes</Link>
          </div>
        </div>
      </div>

      <nav className="hero__links" aria-label="Collections" data-load>
        <Link to="/shop/oils" className="link">Perfume oils</Link>
        <Link to="/shop/bakhoor" className="link">Bakhoor</Link>
        <Link to="/shop/gift-sets" className="link">Gift sets</Link>
      </nav>
    </section>
  );
}
