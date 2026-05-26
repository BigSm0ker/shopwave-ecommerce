import { getToken } from "@/utils/token.util";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  auth?: boolean;
}

export class ApiServiceError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiServiceError";
    this.status = status;
    this.data = data;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const buildHeaders = (options?: RequestOptions): HeadersInit => {
  const headers = new Headers(options?.headers);

  if (!headers.has("Content-Type") && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options?.auth !== false) {
    const token = getToken();

    if (token) {
      headers.set("Authorization", token);
    }
  }

  return headers;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");

  if (!response.ok) {
    const errorData = hasJson ? await response.json() : await response.text();

    throw new ApiServiceError(
      `Error HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (hasJson) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
};

export const apiService = {
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: options.method ?? "GET",
      headers: buildHeaders(options),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    return parseResponse<T>(response);
  },

  get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};