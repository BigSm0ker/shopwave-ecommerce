"use client";

import { useEffect, useState, FormEvent } from "react";
import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user.service";
import type { UserProfile, Address } from "@/models/user.model";

function ProfileContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Estado del formulario mapeado al contrato JSON del backend
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    async function loadFullProfile() {
      if (!user) return;

      try {
        // Obtenemos los datos detallados (incluyendo el arreglo de direcciones)
        const data = await userService.getProfile();

        const primaryAddress =
          data.addresses && data.addresses.length > 0
            ? data.addresses[0]
            : null;

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
      } catch (err) {
        setError("No se pudo sincronizar la información del perfil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFullProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedAddress: Address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        mobile: formData.mobile,
      };

      const updatedProfile: Partial<UserProfile> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        // Si ya existía una dirección la modificamos, de lo contrario inicializamos el arreglo
        addresses: [updatedAddress],
      };

      await userService.updateProfile(updatedProfile);
      setSuccess(true);
    } catch (err) {
      setError("Error al guardar los cambios en el servidor.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <p
            className="font-semibold animate-pulse"
            style={{ color: "var(--foreground)" }}
          >
            Cargando datos de cuenta...
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto py-6">
        <h1
          className="text-3xl font-bold mb-2"
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
          className="p-6 rounded-2xl border shadow-sm space-y-6 transition-all"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {error && (
            <div className="p-3 bg-red-100/80 text-red-800 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100/80 text-green-800 rounded-xl text-sm border border-green-200">
              ¡Tus cambios han sido guardados con éxito!
            </div>
          )}

          {/* SECCIÓN: Cuenta */}
          <div>
            <h2
              className="text-lg font-bold mb-4 border-b pb-1"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              Datos de Usuario
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full p-2.5 border rounded-xl bg-slate-50 cursor-not-allowed text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    opacity: 0.6,
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Teléfono Celular
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2
              className="text-lg font-bold mb-4 border-b pb-1"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
            >
              Dirección de Entrega
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Calle / Avenida y Número
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  placeholder="Ej. Av. Siempre Viva 123"
                  required
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Estado / Departamento
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  Código Postal
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Área de Envío */}
          <div
            className="flex justify-between items-center pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-slate-100"
              style={{ color: "var(--foreground)" }}
            >
              Rol: {user?.role}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer"
              style={{
                backgroundColor: saving
                  ? "var(--primary-hover)"
                  : "var(--primary)",
                color: "var(--surface)",
              }}
            >
              {saving ? "Guardando..." : "Guardar Ajustes"}
            </button>
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
