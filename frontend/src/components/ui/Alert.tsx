interface AlertProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  title?: string;
  onClose?: () => void;
}

const alertStyles = {
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  error: "border-red-400/30 bg-red-500/10 text-red-200",
  info: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  warning: "border-amber-400/30 bg-amber-500/10 text-amber-200",
};

export default function Alert({
  message,
  type = "success",
  title,
  onClose,
}: AlertProps) {
  return (
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
        ${alertStyles[type]}
      `}
      role="alert"
    >
      <div>
        {title && <p className="mb-1 font-bold">{title}</p>}
        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-70 transition hover:opacity-100"
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      )}
    </div>
  );
}