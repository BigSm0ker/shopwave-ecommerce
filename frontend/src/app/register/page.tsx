"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { FormState } from "@/types/form-state.type";

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

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      mobile: form.mobile.trim(),
    };

    const hasEmptyFields = Object.values(cleanForm).some((value) => !value);

    if (hasEmptyFields) {
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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                ShopWave
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Crea tu cuenta y empieza a comprar mejor.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                Regístrate para acceder al catálogo, carrito, pedidos y perfil
                de usuario.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 text-sm text-white/85">
              Formulario preparado para conectarse con /auth/signup del backend.
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Registro
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white">
                Crea una cuenta
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Completa tus datos para registrarte en la tienda.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-slate-200"
                    >
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                      placeholder="Juan"
                      disabled={formState.isLoading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-slate-200"
                    >
                      Apellido
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                      placeholder="Pérez"
                      disabled={formState.isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="usuario@correo.com"
                    disabled={formState.isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Celular
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    value={form.mobile}
                    onChange={(event) => updateField("mobile", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="70000000"
                    disabled={formState.isLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="Mínimo 4 caracteres"
                    disabled={formState.isLoading}
                  />
                </div>

                <div aria-live="polite">
                  {formState.error && (
                    <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {formState.error}
                    </p>
                  )}

                  {formState.success && (
                    <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                      {formState.success}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {formState.isLoading ? "Registrando..." : "Crear cuenta"}
                </button>
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
