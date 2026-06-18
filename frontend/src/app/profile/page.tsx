"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import type { UserProfile, Address } from "@/models/user.model";
import type { FieldErrors, ProfileField } from "@/utils/validation.util";
import {
  getErrorMessage,
  hasFormErrors,
  validateProfileForm,
} from "@/utils/validation.util";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const initialFormState: ProfileFormState = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
};

function ProfileContent() {
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ProfileField>>({});
  const [formData, setFormData] = useState<ProfileFormState>(initialFormState);

  useEffect(() => {
    async function loadFullProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const data = await userService.getProfile();
        const primaryAddress = data.addresses?.[0] ?? null;

        setFormData({
          firstName: data.firstName || user.firstName || "",
          lastName: data.lastName || user.lastName || "",
          email: data.email || user.email || "",
          mobile: data.mobile || user.mobile || "",
          streetAddress: primaryAddress?.streetAddress || "",
          city: primaryAddress?.city || "",
          state: primaryAddress?.state || "",
          zipCode: primaryAddress?.zipCode || "",
        });
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError,
            "No se pudo sincronizar la información del perfil."
          )
        );
      } finally {
        setLoading(false);
      }
    }

    loadFullProfile();
  }, [user]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(false);

    const nextErrors = validateProfileForm(formData);
    setFieldErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      setError("Corrige los campos marcados antes de guardar.");
      setSaving(false);
      return;
    }

    try {
      const updatedAddress: Address = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        mobile: formData.mobile.trim(),
      };

      const updatedProfile: Partial<UserProfile> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobile: formData.mobile.trim(),
        addresses: [updatedAddress],
      };

      await userService.updateProfile(updatedProfile);
      setSuccess(true);
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Error al guardar los cambios en el servidor."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const inputBaseClass =
    "w-full rounded-xl border p-2.5 text-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed";

  const getInputClass = (field?: ProfileField) => {
    const hasError = field ? Boolean(fieldErrors[field]) : false;

    return `${inputBaseClass} ${
      hasError
        ? "border-rose-400 focus:ring-rose-400/30"
        : "focus:ring-[var(--primary)]"
    }`;
  };

  const inputStyle = {
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-3xl py-6">
          <div className="mb-8 space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>

          <div
            className="space-y-6 rounded-2xl border p-6 shadow-sm"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <Skeleton className="h-6 w-44" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>

            <Skeleton className="h-6 w-52" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl py-6">
        <h1
          className="mb-2 text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Mi Perfil
        </h1>

        <p
          className="mb-8 text-sm"
          style={{ color: "var(--foreground)", opacity: 0.8 }}
        >
          Gestiona tu información de cuenta y las direcciones predeterminadas
          para tus compras.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border p-4 shadow-sm transition-all sm:p-6"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {error && <Alert message={error} type="error" />}

          {success && (
            <Alert
              message="Tus cambios han sido guardados con éxito."
              type="success"
            />
          )}

          <div>
            <h2
              className="mb-4 border-b pb-1 text-lg font-bold"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              Datos de Usuario
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Nombre
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={getInputClass("firstName")}
                  style={inputStyle}
                />

                {fieldErrors.firstName && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Apellido
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={getInputClass("lastName")}
                  style={inputStyle}
                />

                {fieldErrors.lastName && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Correo Electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={getInputClass()}
                  style={{
                    ...inputStyle,
                    opacity: 0.6,
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Teléfono Celular
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={getInputClass("mobile")}
                  style={inputStyle}
                />

                {fieldErrors.mobile && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.mobile}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2
              className="mb-4 border-b pb-1 text-lg font-bold"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              Dirección de Entrega
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Calle / Avenida y Número
                </label>

                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className={getInputClass("streetAddress")}
                  style={inputStyle}
                  placeholder="Ej. Av. Siempre Viva 123"
                />

                {fieldErrors.streetAddress && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.streetAddress}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Ciudad
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={getInputClass("city")}
                  style={inputStyle}
                />

                {fieldErrors.city && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.city}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Estado / Departamento
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={getInputClass("state")}
                  style={inputStyle}
                />

                {fieldErrors.state && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.state}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label
                  className="mb-1 block text-xs font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Código Postal
                </label>

                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={getInputClass("zipCode")}
                  style={inputStyle}
                />

                {fieldErrors.zipCode && (
                  <p className="mt-1 text-xs font-medium text-rose-400">
                    {fieldErrors.zipCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="w-fit rounded bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--foreground)" }}
            >
              Rol: {user?.role ?? "USER"}
            </span>

            <Button type="submit" isLoading={saving} disabled={saving}>
              Guardar ajustes
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}