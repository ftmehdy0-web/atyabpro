import { BagLines } from '../components/BagLines';
import { Suggestions } from '../components/Suggestions';
import { orderEmail, orderWhatsapp } from '../lib/order';
import { formatPrice } from '../lib/site';
import { useSeo } from '../lib/useSeo';
import { useCart, useCartActions } from '../state/cart';

export default function Bag() {
  const { lines, count, subtotal } = useCart();
  const { clear } = useCartActions();
  useSeo('Your bag', 'Your Atyab bag. Send the order on WhatsApp or by email; delivery and payment are confirmed with you.');

  return (
    <div className="bag">
      <h1 className="page-title">Your bag</h1>
      {lines.length === 0 ? (
        <div className="empty empty--left">
          <p>Your bag is empty. Everything you add stays here on this device until you send the order.</p>
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
                if (window.confirm('Remove everything from your bag?')) clear();
              }}
            >
              Empty the bag
            </button>
          </div>
          <aside className="summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="summary__title">Order summary</h2>
            <p className="total">
              <span>{count} {count === 1 ? 'item' : 'items'}</span>
              <span className="nums">{formatPrice(subtotal)}</span>
            </p>
            <p className="total total--muted">
              <span>Delivery</span>
              <span>Confirmed on WhatsApp</span>
            </p>
            <p className="note">
              Online payment is not connected yet. Sending the order passes it to Atyab, who confirm the total with delivery and how to pay.
            </p>
            <a className="button button--full" href={orderWhatsapp(lines, subtotal)} target="_blank" rel="noopener noreferrer">
              Send order on WhatsApp
            </a>
            <a className="button button--quiet button--full" href={orderEmail(lines, subtotal)}>
              Send order by email
            </a>
          </aside>
        </div>
      )}
    </div>
  );
}
