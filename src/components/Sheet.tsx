import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/lang';
import { Icon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: 'right' | 'full';
  children: ReactNode;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A modal panel on the native <dialog>: focus is trapped, Escape closes it,
 * and the page behind is inert. Clicking the backdrop closes it too.
 * Closing plays an exit animation first ([data-closing]); the dialog only
 * really closes, and its contents unmount, once that animation has finished.
 */
export function Sheet({ open, onClose, label, side = 'right', children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useLang();
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const root = document.documentElement;

    if (open) {
      setMounted(true);
      d.removeAttribute('data-closing');
      if (!d.open) d.showModal();
      root.classList.add('is-locked');
      return;
    }
    if (!d.open) return;

    const finish = () => {
      d.removeAttribute('data-closing');
      if (d.open) d.close();
      root.classList.remove('is-locked');
      setMounted(false);
    };
    if (reducedMotion()) {
      finish();
      return;
    }
    d.setAttribute('data-closing', '');
    const panel = d.querySelector('.sheet__panel');
    // Children animate too and their events bubble, so only the panel's own end counts.
    const onEnd = (e: Event) => { if (e.target === panel) finish(); };
    const fallback = window.setTimeout(finish, 450);
    panel?.addEventListener('animationend', onEnd);
    return () => {
      window.clearTimeout(fallback);
      panel?.removeEventListener('animationend', onEnd);
    };
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
        {(open || mounted) && children}
      </div>
    </dialog>
  );
}
