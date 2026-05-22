export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: boolean;
  success?: boolean;
  error?: string;
}

export interface ApiError {
  error?: string;
  message?: string;
  details?: string;
  timestamp?: string;
}