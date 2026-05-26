"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AuthFeedback,
  AuthPageShell,
  AuthSubmitButton,
  AuthTextField,
} from "@/components/forms";
import type { FieldError, FormState } from "@/types/form-state.type";
import { isRequired, isValidEmail } from "@/utils/validation.util";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const getFieldError = (field: string) => {
    return fieldErrors.find((error) => error.field === field)?.message;
  };

  const validateForm = () => {
    const errors: FieldError[] = [];
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!isRequired(cleanEmail)) {
      errors.push({
        field: "email",
        message: "El correo es obligatorio.",
      });
    } else if (!isValidEmail(cleanEmail)) {
      errors.push({
        field: "email",
        message: "Ingresa un correo válido.",
      });
    }

    if (!isRequired(cleanPassword)) {
      errors.push({
        field: "password",
        message: "La contraseña es obligatoria.",
      });
    }

    setFieldErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormState({
      isLoading: false,
      error: null,
      success: null,
    });

    const isValid = validateForm();

    if (!isValid) {
      setFormState({
        isLoading: false,
        error: "Revisa los campos marcados antes de continuar.",
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
          error={getFieldError("email")}
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
          error={getFieldError("password")}
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
