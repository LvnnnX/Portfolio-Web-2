import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  /** Accessible name for the dialog — normally the entry's title. */
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Accessible modal shared by the Experience and Projects detail views.
 *
 * Handles what a bare `{state && <div>}` cannot: Escape to dismiss, background
 * scroll lock, focus moved into the dialog and restored to the trigger on
 * close, focus trapped while open, and dialog semantics for assistive tech.
 */
export default function Modal({ title, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep Tab inside the panel while the dialog is open.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="bg-background w-full max-w-2xl my-auto rounded-2xl border border-border relative flex flex-col outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <span id={titleId} className="sr-only">
          {title}
        </span>

        <div className="sticky top-0 right-0 p-4 flex justify-end z-20">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
