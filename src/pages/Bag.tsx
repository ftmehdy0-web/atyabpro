import { BagLines } from '../components/BagLines';
import { Suggestions } from '../components/Suggestions';
import { orderEmail, orderWhatsapp } from '../lib/order';
import { useLang } from '../i18n/lang';
import { useSeo } from '../lib/useSeo';
import { useCart, useCartActions } from '../state/cart';

export default function Bag() {
  const { lines, count, subtotal } = useCart();
  const { clear } = useCartActions();
  const { lang, t, price } = useLang();
  const b = t.bagPage;
  useSeo(b.title, t.seo.bag);

  return (
    <div className="bag">
      <h1 className="page-title">{b.title}</h1>
      {lines.length === 0 ? (
        <div className="empty empty--left">
          <p>{b.empty}</p>
          <Suggestions />
        </div>
      ) : (
        <div className="bag__grid">
          <div>
            <BagLines lines={lines} />
            <button
              type="button"
              className="text-button bag__clear"
              onClick={() => {
                if (window.confirm(b.confirmEmpty)) clear();
              }}
            >
              {b.emptyIt}
            </button>
          </div>
          <aside className="summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="summary__title">{b.summary}</h2>
            <p className="total">
              <span>{b.items(count)}</span>
              <span className="nums">{price(subtotal)}</span>
            </p>
            <p className="total total--muted">
              <span>{b.delivery}</span>
              <span>{b.onWa}</span>
            </p>
            <p className="note">
              {b.payNote}
            </p>
            <a className="button button--gold button--full" href={orderWhatsapp(lines, subtotal, lang)} target="_blank" rel="noopener noreferrer">
              {b.sendWa}
            </a>
            <a className="button button--quiet button--full" href={orderEmail(lines, subtotal, lang)}>
              {b.sendEmail}
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
