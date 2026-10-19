import { Link } from 'react-router';
import { formatPrice } from '../lib/site';
import { useCartActions, type ResolvedLine } from '../state/cart';
import { ProductImage } from './ProductImage';
import { QtyStepper } from './QtyStepper';

export function BagLines({ lines, onNavigate }: { lines: ResolvedLine[]; onNavigate?: () => void }) {
  const { setQty, remove } = useCartActions();
  return (
    <ul className="baglines">
      {lines.map((l) => (
        <li key={l.key} className="bagline">
          <Link to={`/product/${l.product.slug}`} className="bagline__pic" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
            <ProductImage product={l.product} alt="" sizes="96px" />
          </Link>
          <div className="bagline__body">
            <div className="bagline__top">
              <Link to={`/product/${l.product.slug}`} className="bagline__name" onClick={onNavigate}>
                {l.product.name}
              </Link>
              <span className="bagline__price nums">{formatPrice(l.qty * l.unitPrice)}</span>
            </div>
            <p className="bagline__meta">
              {l.size ? `${l.size} · ` : ''}
              {formatPrice(l.unitPrice)} each
            </p>
            <div className="bagline__controls">
              <QtyStepper value={l.qty} onChange={(n) => setQty(l.id, l.size, n)} label={l.product.name} />
              <button type="button" className="text-button" onClick={() => remove(l.id, l.size)}>
                Remove<span className="sr-only"> {l.product.name}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
