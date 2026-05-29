import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";

export default function OrdersPage() {
  return (
    <AuthGuard>
      <PageLayout>
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm">
          <h1 className="text-2xl font-black text-white">Mis pedidos</h1>
          <p className="mt-2 text-slate-300">Página protegida para consultar el historial del usuario.</p>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}

