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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Panel admin
            </p>
            <h1 className="text-2xl font-black text-slate-950">Administrar productos</h1>
            <p className="mt-2 text-slate-600">Aquí se podrán crear, editar y eliminar productos.</p>
          </div>

          <Link
            href="/admin/products/create"
            className="inline-flex w-fit rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            Crear producto
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-950">Productos cargados</h2>
            <Button type="button" onClick={loadProducts}>Refrescar</Button>
          </div>

          {isLoading ? (
            <p className="text-slate-600">Cargando productos...</p>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : products.length === 0 ? (
            <p className="text-slate-600">No hay productos todavía. Crea el primero desde aquí.</p>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <article key={product.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[120px_1fr_auto] md:items-center">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-slate-950">{product.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{product.description}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      ${product.discountedPrice.toFixed(2)} · Stock: {product.quantity} · Color: {product.color}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Borrar
                    </button>
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
