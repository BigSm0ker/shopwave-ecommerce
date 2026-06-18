"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const toastStyles = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  error: "border-red-400/30 bg-red-500/10 text-red-200",
  info: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
};

export default function Toast({
  message,
  type = "info",
  onClose,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed left-4 right-4 top-20 z-50 sm:left-auto sm:right-6 sm:w-[380px]">
      <div
        className={`
          flex
          items-start
          justify-between
          gap-4
          rounded-xl
          border
          px-4
          py-3
          text-sm
          font-medium
          shadow-xl
          backdrop-blur-md
          ${toastStyles[type]}
        `}
        role="alert"
      >
        <p>{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-70 transition hover:opacity-100"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  );
}