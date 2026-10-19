import { Link } from 'react-router';
import { localize, useLang } from '../i18n/lang';
import { useCartActions, type ResolvedLine } from '../state/cart';
import { ProductImage } from './ProductImage';
import { QtyStepper } from './QtyStepper';

export function BagLines({ lines, onNavigate }: { lines: ResolvedLine[]; onNavigate?: () => void }) {
  const { setQty, remove } = useCartActions();
  const { lang, t, price } = useLang();
  return (
    <ul className="baglines">
      {lines.map((l) => {
        const text = localize(l.product, lang);
        return (
          <li key={l.key} className="bagline">
            <Link to={`/product/${l.product.slug}`} className="bagline__pic" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
              <ProductImage product={l.product} alt="" sizes="96px" />
            </Link>
            <div className="bagline__body">
              <div className="bagline__top">
                <Link to={`/product/${l.product.slug}`} className="bagline__name" onClick={onNavigate}>
                  {text.name}
                </Link>
                <span className="bagline__price nums">{price(l.qty * l.unitPrice)}</span>
              </div>
              <p className="bagline__meta">
                {l.size ? `${text.size(l.size)} · ` : ''}
                {t.drawer.each(price(l.unitPrice))}
              </p>
              <div className="bagline__controls">
                <QtyStepper value={l.qty} onChange={(n) => setQty(l.id, l.size, n)} label={text.name} />
                <button type="button" className="text-button" onClick={() => remove(l.id, l.size)}>
                  {t.drawer.remove}<span className="sr-only"> {text.name}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
