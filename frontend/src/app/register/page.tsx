"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AuthFeedback,
  AuthPageShell,
  AuthSubmitButton,
  AuthTextField,
} from "@/components/forms";
import { simulateSignup } from "@/components/forms/auth-mock.actions";
import type { SignupRequest } from "@/models/auth.model";
import type { FieldError, FormState } from "@/types/form-state.type";
import { isRequired, isValidEmail } from "@/utils/validation.util";

type RegisterForm = SignupRequest;

const initialForm: RegisterForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobile: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const getFieldError = (field: keyof RegisterForm) => {
    return fieldErrors.find((error) => error.field === field)?.message;
  };

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const cleanForm: RegisterForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      mobile: form.mobile.trim(),
    };

    const errors: FieldError[] = [];

    if (!isRequired(cleanForm.firstName)) {
      errors.push({
        field: "firstName",
        message: "El nombre es obligatorio.",
      });
    }

    if (!isRequired(cleanForm.lastName)) {
      errors.push({
        field: "lastName",
        message: "El apellido es obligatorio.",
      });
    }

    if (!isRequired(cleanForm.email)) {
      errors.push({
        field: "email",
        message: "El correo es obligatorio.",
      });
    } else if (!isValidEmail(cleanForm.email)) {
      errors.push({
        field: "email",
        message: "Ingresa un correo válido.",
      });
    }

    if (!isRequired(cleanForm.mobile)) {
      errors.push({
        field: "mobile",
        message: "El celular es obligatorio.",
      });
    }

    if (!isRequired(cleanForm.password)) {
      errors.push({
        field: "password",
        message: "La contraseña es obligatoria.",
      });
    } else if (cleanForm.password.length < 4) {
      errors.push({
        field: "password",
        message: "La contraseña debe tener al menos 4 caracteres.",
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

    const signupData: SignupRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      mobile: form.mobile.trim(),
    };

    try {
      setFormState({
        isLoading: true,
        error: null,
        success: null,
      });

      // TODO: Reemplazar por signup(signupData) desde useAuth cuando Persona 3 termine el AuthContext.
      await simulateSignup(signupData);

      setForm(initialForm);
      setFieldErrors([]);

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
            error={getFieldError("firstName")}
          />

          <AuthTextField
            id="lastName"
            label="Apellido"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(value) => updateField("lastName", value)}
            placeholder="Pérez"
            disabled={formState.isLoading}
            error={getFieldError("lastName")}
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
          error={getFieldError("email")}
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
          error={getFieldError("mobile")}
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
          error={getFieldError("password")}
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
