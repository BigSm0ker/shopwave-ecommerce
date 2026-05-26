"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { FormState } from "@/types/form-state.type";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail || !password.trim()) {
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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
                ShopWave
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Bienvenido de nuevo a tu tienda online.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                Accede a tu cuenta para revisar productos, carrito, pedidos y
                beneficios exclusivos.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 text-sm text-white/85">
              Interfaz preparada para integrarse con JWT y el backend Spring Boot.
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Iniciar sesión
              </p>

              <h2 className="mt-4 text-3xl font-bold text-white">
                Entra a tu cuenta
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Usa tu correo y contraseña para continuar.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
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
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="usuario@correo.com"
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                    placeholder="Tu contraseña"
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
                  {formState.isLoading ? "Procesando..." : "Iniciar sesión"}
                </button>
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
