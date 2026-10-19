import { ProductTile } from '../components/ProductTile';
import { Suggestions } from '../components/Suggestions';
import { getProductById } from '../data/catalog';
import { useSeo } from '../lib/useSeo';
import { useWishlist } from '../state/wishlist';

export default function Wishlist() {
  const { ids } = useWishlist();
  const saved = ids.map(getProductById).filter((p) => p !== undefined);
  useSeo('Wishlist', 'The Atyab pieces you have saved on this device.');

  return (
    <div className="wishlist">
      <h1 className="page-title">Wishlist</h1>
      {saved.length === 0 ? (
        <div className="empty empty--left">
          <p>Nothing saved yet. Tap the heart on any piece to keep it here on this device.</p>
          <Suggestions />
        </div>
      ) : (
        <div className="specs specs--four">
          <h2 className="sr-only">Saved pieces</h2>
          {saved.map((p, i) => (
            <ProductTile key={p.id} product={p} tone={i % 4} />
          ))}
        </div>
      )}
    </div>
  );
}
