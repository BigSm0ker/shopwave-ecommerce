"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AuthFeedback,
  AuthPageShell,
  AuthSubmitButton,
  AuthTextField,
} from "@/components/forms";
import type { FormState } from "@/types/form-state.type";
import { isRequired, isValidEmail } from "@/utils/validation.util";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!isRequired(cleanEmail) || !isRequired(cleanPassword)) {
      setFormState({
        isLoading: false,
        error: "Completa el correo y la contraseña.",
        success: null,
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormState({
        isLoading: false,
        error: "Ingresa un correo válido.",
        success: null,
      });
      return;
    }

    try {
      setFormState({
        isLoading: true,
        error: null,
        success: null,
      });

      await new Promise((resolve) => setTimeout(resolve, 900));

      setFormState({
        isLoading: false,
        error: null,
        success: "Login validado visualmente. Pendiente conexión con useAuth.",
      });
    } catch {
      setFormState({
        isLoading: false,
        error: "No se pudo iniciar sesión. Intenta nuevamente.",
        success: null,
      });
    }
  };

  return (
    <AuthPageShell
      eyebrow="Iniciar sesión"
      title="Entra a tu cuenta"
      description="Usa tu correo y contraseña para continuar."
      sideTitle="Bienvenido de nuevo a tu tienda online."
      sideDescription="Accede a tu cuenta para revisar productos, carrito, pedidos y beneficios exclusivos."
      sideNote="Interfaz preparada para integrarse con JWT y el backend Spring Boot."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthTextField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="usuario@correo.com"
          disabled={formState.isLoading}
        />

        <AuthTextField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="Tu contraseña"
          disabled={formState.isLoading}
        />

        <AuthFeedback formState={formState} />

        <AuthSubmitButton
          isLoading={formState.isLoading}
          loadingText="Procesando..."
        >
          Iniciar sesión
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Regístrate aquí
        </Link>
      </p>
    </AuthPageShell>
  );
}
