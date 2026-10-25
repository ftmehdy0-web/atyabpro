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
 * The panel moves with CSS transitions driven by data-state: "enter" holds it
 * at its starting pose, "open" brings it in, "closing" takes it out. The dialog
 * only really closes, and its contents unmount, once the exit has finished.
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
      if (!d.open) {
        d.dataset.state = 'enter';
        d.showModal();
      }
      root.classList.add('is-locked');
      // showModal() makes the whole page inert, so the frame it lands in is slow.
      // Paint that frame at the starting pose and move on the next one; a motion
      // timed from the slow frame would already be part-way in when first seen.
      let next = 0;
      const first = requestAnimationFrame(() => {
        next = requestAnimationFrame(() => { d.dataset.state = 'open'; });
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(next);
      };
    }
    if (!d.open) return;

    const finish = () => {
      delete d.dataset.state;
      if (d.open) d.close();
      root.classList.remove('is-locked');
      setMounted(false);
    };
    if (reducedMotion()) {
      finish();
      return;
    }
    d.dataset.state = 'closing';
    const panel = d.querySelector<HTMLElement>('.sheet__panel');
    // Children transition too and their events bubble, so only the panel's own end counts.
    const onEnd = (e: TransitionEvent) => { if (e.target === panel && e.propertyName === 'transform') finish(); };
    const fallback = window.setTimeout(finish, 450);
    panel?.addEventListener('transitionend', onEnd);
    return () => {
      window.clearTimeout(fallback);
      panel?.removeEventListener('transitionend', onEnd);
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
