import { ProductTile } from '../components/ProductTile';
import { Suggestions } from '../components/Suggestions';
import { getProductById } from '../data/catalog';
import { useLang } from '../i18n/lang';
import { useSeo } from '../lib/useSeo';
import { useWishlist } from '../state/wishlist';

export default function Wishlist() {
  const { ids } = useWishlist();
  const saved = ids.map(getProductById).filter((p) => p !== undefined);
  const { t } = useLang();
  useSeo(t.wishlist, t.seo.wishlist);

  return (
    <div className="wishlist">
      <h1 className="page-title">{t.wishlist}</h1>
      {saved.length === 0 ? (
        <div className="empty empty--left">
          <p>{t.wishlistPage.empty}</p>
          <Suggestions />
        </div>
      ) : (
        <div className="specs specs--four">
          <h2 className="sr-only">{t.wishlistPage.saved}</h2>
          {saved.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
