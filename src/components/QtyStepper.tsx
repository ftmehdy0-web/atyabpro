import { useLang } from '../i18n/lang';
import { MAX_LINE_QTY } from '../state/cart';
import { Icon } from './Icon';

interface Props {
  value: number;
  onChange: (n: number) => void;
  label: string;
}

export function QtyStepper({ value, onChange, label }: Props) {
  const { t } = useLang();
  return (
    <div className="qty" role="group" aria-label={t.drawer.quantity(label)}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t.drawer.fewer}>
        <Icon name="minus" size={18} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_LINE_QTY} aria-label={t.drawer.more}>
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
