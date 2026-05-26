import type { HTMLInputTypeAttribute } from "react";

interface AuthTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
}

export function AuthTextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  autoComplete,
  disabled = false,
  error,
}: AuthTextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>

      <input
        id={id}
        name={name ?? id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`mt-2 w-full rounded-xl border bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 ${
          error
            ? "border-red-400 focus:border-red-300 focus:ring-2 focus:ring-red-300/30"
            : "border-white/10 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
        }`}
      />

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
