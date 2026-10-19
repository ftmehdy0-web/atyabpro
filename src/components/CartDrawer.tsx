import { Link } from 'react-router';
import { useLang } from '../i18n/lang';
import { orderWhatsapp } from '../lib/order';
import { useCart, useCartActions } from '../state/cart';
import { BagLines } from './BagLines';
import { Sheet } from './Sheet';

export function CartDrawer() {
  const { lines, count, subtotal, drawerOpen } = useCart();
  const { closeDrawer } = useCartActions();
  const { lang, t, price } = useLang();

  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} label={t.bagPage.title}>
      <div className="drawer">
        <h2 className="drawer__title">
          {t.bagPage.title} <span className="drawer__count nums">({count})</span>
        </h2>
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>{t.drawer.empty}</p>
            <Link to="/shop" className="button" onClick={closeDrawer}>{t.drawer.browse}</Link>
          </div>
        ) : (
          <>
            <BagLines lines={lines} onNavigate={closeDrawer} />
            <div className="drawer__foot">
              <p className="total">
                <span>{t.drawer.subtotal}</span>
                <span className="nums">{price(subtotal)}</span>
              </p>
              <p className="note">{t.product.deliveryNote}</p>
              <a className="button button--full" href={orderWhatsapp(lines, subtotal, lang)} target="_blank" rel="noopener noreferrer">
                {t.bagPage.sendWa}
              </a>
              <Link to="/bag" className="button button--ink button--full" onClick={closeDrawer}>{t.drawer.view}</Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
