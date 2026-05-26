import type { ReactNode } from "react";

interface AuthSubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: ReactNode;
}

export function AuthSubmitButton({
  isLoading,
  loadingText,
  children,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
