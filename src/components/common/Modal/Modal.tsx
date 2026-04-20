import type { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  title: string;
  children: ReactNode;
  actions: ReactNode;
}

export function Modal({ title, children, actions }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>

        <div className="modal__body">{children}</div>

        <div className="modal__actions">{actions}</div>
      </div>
    </div>
  );
}
