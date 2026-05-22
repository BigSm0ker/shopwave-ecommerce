export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface FieldError {
  field: string;
  message: string;
}