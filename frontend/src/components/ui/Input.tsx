import React, { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "onChange"> {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | null;
  as?: "input" | "textarea";
  rows?: number;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  as = "input",
  rows = 3,
  className = "",
  ...props
}: InputProps) {
  const isError = Boolean(error);
  const inputId = name ? `input-${name}` : undefined;

  const baseInputStyles = `
    w-full
    rounded-xl
    border
    bg-white/10
    px-4
    py-3
    text-sm
    text-white
    outline-none
    transition-all
    duration-200
    placeholder:text-slate-400
    disabled:cursor-not-allowed
    disabled:opacity-70
    ${
      isError
        ? "border-rose-400/40 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
        : "border-white/10 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
    }
    ${className}
  `;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}

      {as === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={baseInputStyles}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={baseInputStyles}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <span className="text-xs font-medium text-rose-400 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}