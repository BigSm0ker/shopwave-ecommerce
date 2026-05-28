import { apiService } from "@/services/api.service";
import type { SigninCredentials, SignupRequest } from "@/models/auth.model";
import type { User } from "@/models/user.model";
import { setToken } from "@/utils/token.util";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const authService = {
  async signin(credentials: SigninCredentials): Promise<User> {
    const basicToken = btoa(`${credentials.email}:${credentials.password}`);

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${basicToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas.");
    }

    const jwt = response.headers.get("Authorization");

    if (jwt) {
      setToken(jwt);
    }

    return response.json() as Promise<User>;
  },

  signup(data: SignupRequest): Promise<User> {
    return apiService.post<User>("/auth/signup", data, { auth: false });
  },

  getProfile(): Promise<User> {
    return apiService.get<User>("/users/profile");
  },
};