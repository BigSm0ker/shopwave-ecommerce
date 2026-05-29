import Link from "next/link";

import PageLayout from "@/components/layout/PageLayout";
import { productService } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await productService.getProducts();

  return (
    <PageLayout>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Catálogo
          </p>
          <h1 className="text-3xl font-black text-slate-950">Nuestros productos</h1>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          Lista consumida directamente desde la API para validar el flujo completo.
        </p>
      </div>
      
      {products.length === 0 ? (
        <p className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          No hay productos disponibles en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-56 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-lg font-semibold text-slate-950">{product.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{product.description}</p>

                <div className="mt-4 flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-950">
                    ${product.discountedPrice.toFixed(2)}
                  </p>
                  {product.discountPersent > 0 && (
                    <p className="text-sm text-rose-500 line-through">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageLayout>
  );
}