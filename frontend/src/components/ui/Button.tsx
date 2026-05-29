import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick,
  variant = "primary",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/30 hover:shadow-white/5";
      case "danger":
        return "border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-500/40 hover:shadow-rose-500/5";
      case "primary":
      default:
        return "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-cyan-400/20";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        px-5
        py-2.5
        rounded-xl
        font-semibold
        text-sm
        transition-all
        duration-200
        hover:scale-[1.02]
        active:scale-[0.98]
        shadow-md
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        disabled:hover:shadow-none
        ${getVariantStyles()}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}