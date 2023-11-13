import React, { ReactNode } from "react";

interface ModalProps {
  header?: string;
  content?: ReactNode;
  modalActions?: ReactNode[];
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Modal = ({
  header,
  content,
  modalActions,
  onClose,
}: ModalProps) => {
  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        {header ? <h3 className="font-bold text-lg">{header}</h3> : null}
        {content ? <p className="py-4">{content}</p> : null}
        {modalActions ? (
          <div className="modal-action">
            {modalActions.map((child, index) => (
              <span key={index}>{child}</span>
            ))}
          </div>
        ) : null}
      </div>
    </dialog>
  );
};
