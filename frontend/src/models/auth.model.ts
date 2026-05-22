import type { User } from "./user.model";

export interface SigninCredentials {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
}

export interface AuthUser extends User {}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  signin: (credentials: SigninCredentials) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}