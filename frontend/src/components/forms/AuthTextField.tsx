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
      <label htmlFor={id} className="block text-sm font-medium text-foreground-muted">
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
        className={`mt-2 w-full rounded-xl border bg-surface-alt/50 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-foreground-muted/60 disabled:cursor-not-allowed disabled:opacity-70 ${
          error
            ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
            : "border-border focus:border-primary focus:ring-2 focus:ring-primary/30"
        }`}
      />

      {error && (
        <p id={errorId} className="mt-2 text-sm text-rose-accent">
          {error}
        </p>
      )}
    </div>
  );
}
