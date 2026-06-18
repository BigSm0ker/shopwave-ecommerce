"use client";

import Link from "next/link";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import PageLayout from "@/components/layout/PageLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCart } from "@/hooks/useCart";

const formatCurrency = (value: number) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

export default function CartPage() {
  const {
    cart,
    isLoading,
    isMutating,
    error,
    updateCartItemQuantity,
    removeCartItem,
  } = useCart();

  const cartItems = cart?.cartItems ?? [];
  const isEmpty = cartItems.length === 0;

  const handleQuantityChange = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeCartItem(cartItemId);
      return;
    }

    await updateCartItemQuantity(cartItemId, quantity);
  };

  return (
    <AuthGuard>
      <PageLayout>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Compra
            </p>

            <h1 className="text-2xl font-black text-white">
              Tu carrito
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Revisa tus productos antes de continuar con el checkout.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-cyan-300"
          >
            Seguir comprando
          </Link>
        </div>

        <div className="mt-6">
          {error && <Alert message={error} type="error" />}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              {[1, 2, 3].map((item) => (
                <article
                  key={item}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[96px_1fr_auto] md:items-center"
                >
                  <Skeleton className="h-24 w-24 rounded-xl" />

                  <div className="space-y-3">
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-20 rounded-xl" />
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl">
              <Skeleton className="h-6 w-32" />

              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>

              <Skeleton className="mt-5 h-11 w-full rounded-xl" />
            </aside>
          </div>
        ) : isEmpty ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center shadow-xl backdrop-blur-sm sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
              🛒
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Tu carrito está vacío
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
              Agrega productos al carrito para poder continuar con tu compra.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300 active:scale-[0.98]"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              {cartItems.map((item) => {
                const itemSubtotal = item.discountedPrice * item.quantity;

                return (
                  <article
                    key={item.id}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg shadow-black/10 transition hover:border-cyan-400/20 md:grid-cols-[96px_1fr_auto] md:items-center"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-bold text-white">
                        {item.product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                          Talla: {item.size}
                        </span>

                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-300">
                          {formatCurrency(item.discountedPrice)} c/u
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-white">
                        Subtotal:{" "}
                        <span className="text-cyan-300">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={isMutating}
                          className="px-3 py-2"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </Button>

                        <span className="flex min-w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm font-bold text-white">
                          {item.quantity}
                        </span>

                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={isMutating}
                          className="px-3 py-2"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        variant="danger"
                        onClick={() => removeCartItem(item.id)}
                        disabled={isMutating}
                        isLoading={isMutating}
                        className="w-full px-3 py-2 md:w-auto"
                      >
                        Quitar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-white">
                Resumen de compra
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Verifica los importes antes de continuar.
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p className="flex items-center justify-between gap-4">
                  <span>Productos</span>
                  <span className="font-bold text-white">
                    {cart?.totalItem ?? 0}
                  </span>
                </p>

                <p className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">
                    {formatCurrency(cart?.totalPrice ?? 0)}
                  </span>
                </p>

                <p className="flex items-center justify-between gap-4 text-emerald-300">
                  <span>Descuento</span>
                  <span className="font-bold">
                    -{formatCurrency(cart?.discounte ?? 0)}
                  </span>
                </p>

                <p className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-base font-black text-white">
                  <span>Total</span>
                  <span className="text-cyan-300">
                    {formatCurrency(cart?.totalDiscountedPrice ?? 0)}
                  </span>
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-300 active:scale-[0.98]"
              >
                Continuar al checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Agregar más productos
              </Link>
            </aside>
          </div>
        )}
      </PageLayout>
    </AuthGuard>
  );
}