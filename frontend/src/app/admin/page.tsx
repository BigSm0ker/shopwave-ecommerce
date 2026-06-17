import Link from "next/link";

import { AdminGuard } from "@/guards/AdminGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function AdminPage() {
  return (
    <AdminGuard>
      <PageLayout>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Panel admin
            </p>
            <h1 className="text-3xl font-black text-white">Panel de administración</h1>
            <p className="mt-2 text-slate-300">Acceso restringido para usuarios con rol ADMIN.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/products"
              className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/5 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Productos</h2>
              <p className="mt-2 text-sm text-slate-300">Ver listado, crear, editar y eliminar productos.</p>
            </Link>

            <Link
              href="/admin/orders"
              className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/5 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Órdenes / Ventas</h2>
              <p className="mt-2 text-sm text-slate-300">Supervisar pedidos, realizar despachos y cambiar estados.</p>
            </Link>

            <Link
              href="/admin/products/create"
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/20 p-6 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/5 backdrop-blur-sm hover:from-cyan-500/30 hover:via-blue-600/30 hover:to-indigo-600/30"
            >
              <h2 className="text-lg font-bold text-cyan-300">Crear producto</h2>
              <p className="mt-2 text-sm text-slate-200">Ir directo al formulario para subir un nuevo producto.</p>
            </Link>
          </div>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
