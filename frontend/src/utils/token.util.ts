const TOKEN_KEY = "shopwave_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => {
  return Boolean(getToken());
};

export const decodeToken = <T>(token: string): T | null => {
  try {
    let cleanToken = token;
    if (token.startsWith("Bearer ")) {
      cleanToken = token.substring(7);
    }

    const parts = cleanToken.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    let decodedStr = "";
    if (typeof window !== "undefined" && typeof window.atob !== "undefined") {
      decodedStr = window.atob(base64);
    } else if (typeof Buffer !== "undefined") {
      decodedStr = Buffer.from(base64, "base64").toString("utf-8");
    } else {
      return null;
    }

    const jsonPayload = decodeURIComponent(
      decodedStr
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as T;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken<{ exp?: number }>(token);
  if (!decoded || !decoded.exp) return true;

  // exp está en segundos, Date.now() en milisegundos
  return decoded.exp * 1000 < Date.now();
};