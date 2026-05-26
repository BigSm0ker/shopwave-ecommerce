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
}: AuthTextFieldProps) {
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
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
}
