import { useLang } from '../i18n/lang';
import { useWishlist } from '../state/wishlist';
import { Icon } from './Icon';

export function WishButton({ id, name, className = 'wish' }: { id: string; name: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(id);
  const { t } = useLang();
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={on ? t.card.unsave(name) : t.card.save(name)}
      onClick={() => toggle(id)}
    >
      <Icon name="heart" filled={on} size={20} />
    </button>
  );
}
