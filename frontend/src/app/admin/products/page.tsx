"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import Toast from "@/components/ui/Toast";
import PageLayout from "@/components/layout/PageLayout";
import { AdminGuard } from "@/guards/AdminGuard";
import type { Product } from "@/models/product.model";
import { productService } from "@/services/product.service";
import { getErrorMessage } from "@/utils/validation.util";

const formatCurrency = (value: number) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      const data = await productService.getProducts();
      setProducts(data);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "No se pudieron cargar los productos.")
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openDeleteModal = (product: Product) => {
    setError(null);
    setSuccess(null);
    setProductToDelete(product);
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeletingId(productToDelete.id);
      setError(null);
      setSuccess(null);

      await productService.deleteProduct(productToDelete.id);

      setProducts((current) =>
        current.filter((product) => product.id !== productToDelete.id)
      );

      setSuccess("Producto eliminado correctamente.");
      setProductToDelete(null);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "No se pudo eliminar el producto.")
      );
    } finally {
      setDeletingId(null);
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

            <h1 className="text-2xl font-black text-white">
              Administrar productos
            </h1>

            <p className="mt-2 text-slate-300">
              Aquí se podrán crear, editar y eliminar productos.
            </p>
          </div>

          <Link
            href="/admin/products/create"
            className="inline-flex w-fit rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:scale-[1.02] hover:bg-cyan-300 hover:shadow-cyan-400/20 active:scale-[0.98]"
          >
            Crear producto
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Productos cargados
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Total registrados: {products.length}
              </p>
            </div>

            <Button
              type="button"
              onClick={() => loadProducts(true)}
              disabled={isLoading || isRefreshing}
              isLoading={isRefreshing}
            >
              Refrescar
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <article
                  key={item}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
                >
                  <Skeleton className="h-24 w-24 rounded-xl" />

                  <div className="space-y-3">
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-full max-w-2xl" />
                    <Skeleton className="h-4 w-72" />
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <Skeleton className="h-10 w-20 rounded-xl" />
                    <Skeleton className="h-10 w-20 rounded-xl" />
                  </div>
                </article>
              ))}
            </div>
          ) : error ? (
            <div className="space-y-4">
              <Alert message={error} type="error" />

              <Button type="button" onClick={() => loadProducts()}>
                Intentar nuevamente
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center">
              <h3 className="text-lg font-bold text-white">
                No hay productos todavía
              </h3>

              <p className="mt-2 text-sm text-slate-300">
                Crea el primer producto para comenzar a llenar el catálogo.
              </p>

              <Link
                href="/admin/products/create"
                className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-md transition hover:scale-[1.02] hover:bg-cyan-300 active:scale-[0.98]"
              >
                Crear producto
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-cyan-400/20 md:grid-cols-[120px_1fr_auto] md:items-center"
                >
                  <div className="h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white">
                      {product.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-300">
                      {product.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-300">
                        {formatCurrency(product.discountedPrice)}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        Stock: {product.quantity}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        Color: {product.color}
                      </span>

                      {product.brand && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                          Marca: {product.brand}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 hover:text-white active:scale-[0.98]"
                    >
                      Editar
                    </Link>

                    <Button
                      variant="danger"
                      onClick={() => openDeleteModal(product)}
                      className="px-4 py-2"
                      disabled={Boolean(deletingId)}
                    >
                      Borrar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <Toast
          message={success}
          type="success"
          onClose={() => setSuccess(null)}
        />

        <Modal
          isOpen={Boolean(productToDelete)}
          onClose={closeDeleteModal}
          title="Eliminar producto"
        >
          <div className="space-y-4">
            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong className="text-white">{productToDelete?.title}</strong>?
            </p>

            <p className="text-sm text-slate-400">
              Esta acción eliminará el producto del catálogo del administrador.
            </p>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
              >
                Cancelar
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={Boolean(deletingId)}
                disabled={Boolean(deletingId)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </PageLayout>
    </AdminGuard>
  );
}