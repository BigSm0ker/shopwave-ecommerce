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
import { hasEmptyFields, isValidEmail } from "@/utils/validation.util";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
}

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobile: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(initialForm);

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanForm: RegisterForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      mobile: form.mobile.trim(),
    };

    if (hasEmptyFields(Object.values(cleanForm))) {
      setFormState({
        isLoading: false,
        error: "Completa todos los campos antes de registrarte.",
        success: null,
      });
      return;
    }

    if (!isValidEmail(cleanForm.email)) {
      setFormState({
        isLoading: false,
        error: "Ingresa un correo válido.",
        success: null,
      });
      return;
    }

    if (cleanForm.password.length < 4) {
      setFormState({
        isLoading: false,
        error: "La contraseña debe tener al menos 4 caracteres.",
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

      setForm(initialForm);

      setFormState({
        isLoading: false,
        error: null,
        success: "Registro validado visualmente. Pendiente conexión con auth.service.",
      });
    } catch {
      setFormState({
        isLoading: false,
        error: "No se pudo completar el registro. Intenta nuevamente.",
        success: null,
      });
    }
  };

  return (
    <AuthPageShell
      eyebrow="Registro"
      title="Crea una cuenta"
      description="Completa tus datos para registrarte en la tienda."
      sideTitle="Crea tu cuenta y empieza a comprar mejor."
      sideDescription="Regístrate para acceder al catálogo, carrito, pedidos y perfil de usuario."
      sideNote="Formulario preparado para conectarse con /auth/signup del backend."
    >
      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthTextField
            id="firstName"
            label="Nombre"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(value) => updateField("firstName", value)}
            placeholder="Juan"
            disabled={formState.isLoading}
          />

          <AuthTextField
            id="lastName"
            label="Apellido"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(value) => updateField("lastName", value)}
            placeholder="Pérez"
            disabled={formState.isLoading}
          />
        </div>

        <AuthTextField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
          placeholder="usuario@correo.com"
          disabled={formState.isLoading}
        />

        <AuthTextField
          id="mobile"
          label="Celular"
          type="tel"
          autoComplete="tel"
          value={form.mobile}
          onChange={(value) => updateField("mobile", value)}
          placeholder="70000000"
          disabled={formState.isLoading}
        />

        <AuthTextField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(value) => updateField("password", value)}
          placeholder="Mínimo 4 caracteres"
          disabled={formState.isLoading}
        />

        <AuthFeedback formState={formState} />

        <AuthSubmitButton
          isLoading={formState.isLoading}
          loadingText="Registrando..."
        >
          Crear cuenta
        </AuthSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-300 hover:text-cyan-200"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthPageShell>
  );
}
