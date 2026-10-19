import { Link } from 'react-router';
import { orderWhatsapp } from '../lib/order';
import { formatPrice } from '../lib/site';
import { useCart, useCartActions } from '../state/cart';
import { BagLines } from './BagLines';
import { Sheet } from './Sheet';

export function CartDrawer() {
  const { lines, count, subtotal, drawerOpen } = useCart();
  const { closeDrawer } = useCartActions();

  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} label="Your bag">
      <div className="drawer">
        <h2 className="drawer__title">
          Your bag <span className="drawer__count nums">({count})</span>
        </h2>
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Your bag is empty.</p>
            <Link to="/shop" className="button" onClick={closeDrawer}>Browse the shop</Link>
          </div>
        ) : (
          <>
            <BagLines lines={lines} onNavigate={closeDrawer} />
            <div className="drawer__foot">
              <p className="total">
                <span>Subtotal</span>
                <span className="nums">{formatPrice(subtotal)}</span>
              </p>
              <p className="note">Delivery and payment are confirmed with you on WhatsApp. No payment is taken on this site.</p>
              <a className="button button--full" href={orderWhatsapp(lines, subtotal)} target="_blank" rel="noopener noreferrer">
                Send order on WhatsApp
              </a>
              <Link to="/bag" className="button button--ink button--full" onClick={closeDrawer}>View bag</Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
