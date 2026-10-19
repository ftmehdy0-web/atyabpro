import { useEffect, useRef, type ReactNode } from 'react';
import { useLang } from '../i18n/lang';
import { Icon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: 'right' | 'full';
  children: ReactNode;
}

/**
 * A modal panel on the native <dialog>: focus is trapped, Escape closes it,
 * and the page behind is inert. Clicking the backdrop closes it too.
 */
export function Sheet({ open, onClose, label, side = 'right', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.classList.toggle('is-locked', open);
  }, [open]);

  useEffect(() => () => document.documentElement.classList.remove('is-locked'), []);

  return (
    <dialog
      ref={ref}
      className={`sheet sheet--${side}`}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet__panel">
        <button type="button" className="sheet__close" onClick={onClose} aria-label={t.close}>
          <Icon name="close" />
        </button>
        {/* Closed sheets render nothing, so the bag and menu cost nothing until opened. */}
        {open && children}
      </div>
    </dialog>
  );
}
