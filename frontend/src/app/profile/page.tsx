"use client";

import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";

function ProfileContent() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-950">Perfil</h1>
        <p className="mt-2 text-slate-600">Tu información de sesión y cuenta.</p>
        {user && (
          <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <p><span className="font-semibold">Nombre:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-semibold">Correo:</span> {user.email}</p>
            <p><span className="font-semibold">Celular:</span> {user.mobile}</p>
            <p><span className="font-semibold">Rol:</span> {user.role}</p>
          </div>
        )}
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

