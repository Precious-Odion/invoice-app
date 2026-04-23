import {
  useEffect,
  useId,
  useRef,
  // type KeyboardEvent,
  type ReactNode,
} from "react";
import "./Modal.css";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

interface ModalProps {
  title: string;
  children: ReactNode;
  actions: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, actions, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useLockBodyScroll(true);

  useEffect(() => {
    const modalElement = modalRef.current;

    if (!modalElement) {
      return;
    }

    const focusableElements = modalElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) {
      modalElement.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus();
        }
        return;
      }

      if (activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!modalElement.contains(event.target as Node)) {
        event.stopPropagation();
        firstFocusable.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} aria-hidden="true">
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>

        <div className="modal__body">{children}</div>

        <div className="modal__actions">{actions}</div>
      </div>
    </div>
  );
}
