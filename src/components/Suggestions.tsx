import { useRef } from 'react';
import { Link } from 'react-router';
import { getProduct } from '../data/catalog';
import { enterSections, useGSAP } from '../lib/gsap';
import { ProductTile } from './ProductTile';

// One from each family a first order usually starts with.
const picks = ['tiger-oud', 'nader', 'backhoor', 'dehn-al-oud-Signature']
  .map((slug) => getProduct(slug))
  .filter((p) => p !== undefined);

/** Shown where a list is empty, so the page never ends in a dead end. */
export function Suggestions({ title = 'Start with these' }: { title?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { enterSections(root.current!); }, { scope: root });
  return (
    <section ref={root} className="suggest" data-section aria-labelledby="suggest-title">
      <div className="suggest__head" data-enter>
        <h2 id="suggest-title" className="h2">{title}</h2>
        <Link to="/shop" className="text-button">See all nineteen</Link>
      </div>
      <div className="specs specs--four">
        {picks.map((p, i) => (
          <ProductTile key={p.id} product={p} tone={i % 4} />
        ))}
      </div>
    </section>
  );
}
