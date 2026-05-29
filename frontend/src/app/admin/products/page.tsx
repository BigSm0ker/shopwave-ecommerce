"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageLayout from "@/components/layout/PageLayout";
import { AdminGuard } from "@/guards/AdminGuard";
import type { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los productos."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm("¿Seguro que deseas borrar este producto?");
    if (!confirmed) return;

    try {
      await productService.deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo eliminar el producto."
      );
    }
  };

  return (
    <AdminGuard>
      <PageLayout>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Panel admin
            </p>
            <h1 className="text-2xl font-black text-white">Administrar productos</h1>
            <p className="mt-2 text-slate-300">Aquí se podrán crear, editar y eliminar productos.</p>
          </div>

          <Link
            href="/admin/products/create"
            className="inline-flex w-fit rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 hover:scale-[1.02] shadow-md hover:shadow-cyan-400/20 active:scale-[0.98]"
          >
            Crear producto
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Productos cargados</h2>
            <Button type="button" onClick={loadProducts}>Refrescar</Button>
          </div>

          {isLoading ? (
            <p className="text-slate-300">Cargando productos...</p>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : products.length === 0 ? (
            <p className="text-slate-300">No hay productos todavía. Crea el primero desde aquí.</p>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <article key={product.id} className="grid gap-4 rounded-2xl border border-white/10 p-4 md:grid-cols-[120px_1fr_auto] md:items-center bg-slate-950/40">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-24 w-24 rounded-xl object-cover border border-white/10"
                  />

                  <div>
                    <h3 className="font-bold text-white text-base">{product.title}</h3>
                    <p className="mt-1 text-sm text-slate-300 line-clamp-2">{product.description}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      <span className="text-cyan-400 font-bold">${product.discountedPrice.toFixed(2)}</span> · Stock: {product.quantity} · Color: {product.color}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Editar
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2"
                    >
                      Borrar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </AdminGuard>
  );
}
