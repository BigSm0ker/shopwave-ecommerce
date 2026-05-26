import type { FormState } from "@/types/form-state.type";

interface AuthFeedbackProps {
  formState: FormState;
}

export function AuthFeedback({ formState }: AuthFeedbackProps) {
  if (!formState.error && !formState.success) {
    return null;
  }

  return (
    <div aria-live="polite">
      {formState.error && (
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {formState.error}
        </p>
      )}

      {formState.success && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {formState.success}
        </p>
      )}
    </div>
  );
}
