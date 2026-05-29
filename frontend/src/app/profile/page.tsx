"use client";

import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";

function ProfileContent() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="text-2xl font-black text-white">Perfil</h1>
        <p className="mt-2 text-slate-300">Tu información de sesión y cuenta.</p>
        {user && (
          <div className="mt-6 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <p><span className="font-semibold text-cyan-400">Nombre:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-semibold text-cyan-400">Correo:</span> {user.email}</p>
            <p><span className="font-semibold text-cyan-400">Celular:</span> {user.mobile}</p>
            <p><span className="font-semibold text-cyan-400">Rol:</span> {user.role}</p>
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

