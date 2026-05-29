import Link from "next/link";

import { AdminGuard } from "@/guards/AdminGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function AdminPage() {
  return (
    <AdminGuard>
      <PageLayout>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Panel admin
            </p>
            <h1 className="text-3xl font-black text-slate-950">Panel de administración</h1>
            <p className="mt-2 text-slate-600">Acceso restringido para usuarios con rol ADMIN.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/admin/products"
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-slate-950">Productos</h2>
              <p className="mt-2 text-sm text-slate-600">Ver listado, crear, editar y eliminar productos.</p>
            </Link>

            <Link
              href="/admin/products/create"
              className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm transition hover:-translate-y-1 hover:bg-cyan-600"
            >
              <h2 className="text-lg font-bold">Crear producto</h2>
              <p className="mt-2 text-sm text-white/80">Ir directo al formulario para subir un nuevo producto.</p>
            </Link>
          </div>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
