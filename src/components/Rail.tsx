import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../data/types';
import { useLang } from '../i18n/lang';
import { Icon } from './Icon';
import { ProductTile } from './ProductTile';

interface Props {
  id: string;
  eyebrow: string;
  title: string;
  products: Product[];
  link?: { to: string; label: string };
}

/** A titled row of product cards that scrolls sideways, with arrows on wide screens. */
export function Rail({ id, eyebrow, title, products, link }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const { ar, t } = useLang();

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    // Right-to-left pages scroll towards negative scrollLeft.
    const pos = Math.abs(el.scrollLeft);
    setEdge({ start: pos < 4, end: pos + el.clientWidth > el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, ar]);

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: (ar ? -dir : dir) * el.clientWidth * 0.9, behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <section className="rail" data-section aria-labelledby={id}>
      <header className="section-head" data-enter>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="title">{title}</h2>
      </header>
      <div className="rail__wrap">
        <div className="rail__track" ref={track} onScroll={measure}>
          {products.map((p) => (
            <div className="rail__item" key={p.id} data-enter>
              <ProductTile product={p} />
            </div>
          ))}
        </div>
        {!(edge.start && edge.end) && (
          <>
            <button type="button" className="rail__arrow rail__arrow--prev" onClick={() => move(-1)} disabled={edge.start} aria-label={t.prev(title)}>
              <Icon name="prev" />
            </button>
            <button type="button" className="rail__arrow rail__arrow--next" onClick={() => move(1)} disabled={edge.end} aria-label={t.next(title)}>
              <Icon name="next" />
            </button>
          </>
        )}
      </div>
      {link && (
        <p className="rail__more" data-enter>
          <Link to={link.to} className="button button--line">{link.label}</Link>
        </p>
      )}
    </section>
  );
}
