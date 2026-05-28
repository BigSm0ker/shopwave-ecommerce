"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  AuthContextValue,
  AuthState,
  SigninCredentials,
  SignupRequest,
} from "@/models/auth.model";
import { authService } from "@/services/auth.service";
import {
  getToken,
  removeToken,
  isTokenExpired,
} from "@/utils/token.util";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(initialAuthState);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      if (isTokenExpired(token)) {
        removeToken();
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      try {
        const user = await authService.getProfile();
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error al inicializar sesión desde token:", error);
        removeToken();
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const signin = async (credentials: SigninCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.signin(credentials);
      const token = getToken();

      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      await authService.signup(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
