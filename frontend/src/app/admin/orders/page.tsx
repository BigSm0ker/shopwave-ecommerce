import { AdminGuard } from "@/guards/AdminGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <PageLayout>
        <h1 className="text-2xl font-black text-slate-950">Órdenes administrativas</h1>
        <p className="mt-2 text-slate-600">Sección protegida para revisar pedidos globales.</p>
      </PageLayout>
    </AdminGuard>
  );
}
