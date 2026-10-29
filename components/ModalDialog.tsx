'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type ModalDialogProps = {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  className?: string;
};

export function ModalDialog({ children, labelledBy, onClose, className = '' }: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]'
        )).filter((element) =>
          element.tabIndex >= 0 && !element.matches(':disabled') && element.getClientRects().length > 0
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      className={`fixed inset-0 m-0 h-dvh w-full max-h-none max-w-none border-0 bg-transparent p-4 text-slate-100 open:flex open:items-center open:justify-center backdrop:bg-slate-950/80 backdrop:backdrop-blur-md forced-colors:backdrop:backdrop-blur-none ${className}`}
    >
      {children}
    </dialog>
  );
}
