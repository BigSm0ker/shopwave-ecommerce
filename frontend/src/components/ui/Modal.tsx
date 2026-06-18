"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-slate-950/80
        p-3
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-3xl
          border
          border-white/10
          bg-slate-900/95
          p-4
          text-slate-100
          shadow-2xl
          sm:p-6
        "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="modal-title"
            className="text-xl font-bold text-white sm:text-2xl"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              px-2
              py-1
              text-xl
              leading-none
              text-slate-400
              transition
              hover:bg-white/10
              hover:text-white
            "
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="text-sm text-slate-300 sm:text-base">{children}</div>
      </div>
    </div>
  );
}