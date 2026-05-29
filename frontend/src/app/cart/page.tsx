import PageLayout from "@/components/layout/PageLayout";
import { AuthGuard } from "@/guards/AuthGuard";

export default function CartPage() {
  return (
    <AuthGuard>
      <PageLayout>
        <h1 className="text-2xl font-black text-slate-950">Carrito</h1>
        <p className="mt-2 text-slate-600">Próximamente se mostrará aquí el contenido real del carrito.</p>
      </PageLayout>
    </AuthGuard>
  );
}
