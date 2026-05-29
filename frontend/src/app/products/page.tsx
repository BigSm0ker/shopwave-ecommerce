import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { productService } from "@/services/product.service";
import ProductCard from "@/components/ui/ProductCard";

import type { Product } from "@/models/product.model";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products: Product[] = [];
  let errorMsg = null;

  try {
    products = await productService.getProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
    errorMsg = "No se pudieron cargar los productos desde la base de datos.";
  }

  return (
    <PageLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Catálogo
          </p>
          <h1 className="text-3xl font-black text-foreground-bright mt-1">Nuestros productos</h1>
        </div>
        <p className="max-w-md text-sm text-foreground-muted">
          Lista consumida directamente desde la API para validar el flujo completo.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-rose-accent backdrop-blur-sm shadow-xl">
          <p className="font-semibold">{errorMsg}</p>
          <p className="text-xs mt-1 opacity-80">Por favor verifica que el backend Spring Boot esté en ejecución.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface/60 p-8 text-foreground-muted backdrop-blur-sm shadow-xl">
          <p className="font-semibold text-foreground-bright">No hay productos disponibles</p>
          <p className="text-sm mt-1">Actualmente no se registran productos en el catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              discountedPrice={product.discountedPrice}
              discountPersent={product.discountPersent}
              image={product.imageUrl}
              description={product.description}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}