import { AdminGuard } from "@/guards/AdminGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <PageLayout>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm">
          <h1 className="text-2xl font-black text-white">Órdenes administrativas</h1>
          <p className="mt-2 text-slate-300">Sección protegida para revisar pedidos globales.</p>
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
