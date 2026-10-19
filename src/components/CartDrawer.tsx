import { Link } from 'react-router';
import { localize, useLang } from '../i18n/lang';
import { Icon } from './Icon';
import { orderWhatsapp } from '../lib/order';
import { useCart, useCartActions } from '../state/cart';
import { BagLines } from './BagLines';
import { Sheet } from './Sheet';

export function CartDrawer() {
  const { lines, count, subtotal, drawerOpen, lastAdded } = useCart();
  const { closeDrawer } = useCartActions();
  const { lang, t, price } = useLang();
  const added = lastAdded ? lines.find((l) => l.key === lastAdded) : undefined;

  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} label={t.bagPage.title}>
      <div className="drawer">
        <h2 className="drawer__title">
          {t.bagPage.title} <span className="drawer__count nums">({count})</span>
        </h2>
        {added && (
          <p className="drawer__added" role="status">
            <Icon name="check" size={18} />
            {t.drawer.added(localize(added.product, lang).name)}
          </p>
        )}
        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>{t.drawer.empty}</p>
            <Link to="/shop" className="button" onClick={closeDrawer}>{t.drawer.browse}</Link>
          </div>
        ) : (
          <>
            <BagLines lines={lines} onNavigate={closeDrawer} highlight={lastAdded} />
            <div className="drawer__foot">
              <p className="total">
                <span>{t.drawer.subtotal}</span>
                <span className="nums">{price(subtotal)}</span>
              </p>
              <p className="note">{t.product.deliveryNote}</p>
              <a className="button button--gold button--full" href={orderWhatsapp(lines, subtotal, lang)} target="_blank" rel="noopener noreferrer">
                {t.bagPage.sendWa}
              </a>
              <Link to="/bag" className="button button--quiet button--full" onClick={closeDrawer}>{t.drawer.view}</Link>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}
