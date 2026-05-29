import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function OrdersPage() {
  return (
    <AuthGuard>
      <PageLayout>
        <h1 className="text-2xl font-black text-slate-950">Mis pedidos</h1>
        <p className="mt-2 text-slate-600">Página protegida para consultar el historial del usuario.</p>
      </PageLayout>
    </AuthGuard>
  );
}

