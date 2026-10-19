import { MAX_LINE_QTY } from '../state/cart';
import { Icon } from './Icon';

interface Props {
  value: number;
  onChange: (n: number) => void;
  label: string;
}

export function QtyStepper({ value, onChange, label }: Props) {
  return (
    <div className="qty" role="group" aria-label={`Quantity, ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="One fewer">
        <Icon name="minus" size={18} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_LINE_QTY} aria-label="One more">
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
