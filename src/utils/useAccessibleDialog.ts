import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'video[controls]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true'
  );
}

/**
 * Returns the element that should receive focus after a Tab / Shift+Tab press inside a dialog,
 * wrapping at both ends so keyboard focus never leaves the dialog. Returns null when the
 * browser's default tab order is already correct.
 */
export function getWrappedFocusTarget(
  focusable: HTMLElement[],
  active: Element | null,
  shiftKey: boolean
): HTMLElement | null {
  if (focusable.length === 0) return null;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const index = active ? focusable.indexOf(active as HTMLElement) : -1;

  if (index === -1) return shiftKey ? last : first;
  if (shiftKey && index === 0) return last;
  if (!shiftKey && index === focusable.length - 1) return first;
  return null;
}

/**
 * Modal dialog keyboard behaviour: moves focus into the dialog on open, keeps Tab focus inside,
 * closes on Escape, and returns focus to the element that opened it.
 */
export function useAccessibleDialog(
  isOpen: boolean,
  onClose: () => void,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    const initialTarget =
      initialFocusRef?.current ?? (dialog ? getFocusableElements(dialog)[0] : null) ?? dialog;
    initialTarget?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const target = getWrappedFocusTarget(
        getFocusableElements(dialogRef.current),
        document.activeElement,
        e.shiftKey
      );
      if (target) {
        e.preventDefault();
        target.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, dialogRef, initialFocusRef]);
}
