"use client";

import Link from "next/link";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageLayout from "@/components/layout/PageLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { cart, isLoading, isMutating, error, updateCartItemQuantity, removeCartItem } =
    useCart();

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
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Compra</p>
            <h1 className="text-2xl font-black text-white">Tu carrito</h1>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300"
          >
            Seguir comprando
          </Link>
        </div>

        <div className="mt-6">
          {error && <Alert message={error} type="error" />}
        </div>

        {isLoading ? (
          <p className="mt-8 text-slate-300">Cargando carrito...</p>
        ) : isEmpty ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-slate-300">Agrega productos para comenzar tu compra.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:grid-cols-[96px_1fr_auto] md:items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="h-24 w-24 rounded-xl border border-white/10 object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-white">{item.product.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">Talla: {item.size}</p>
                    <p className="mt-2 text-sm text-cyan-300">
                      ${item.discountedPrice.toFixed(2)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2 md:justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={isMutating}
                      className="px-3 py-2"
                    >
                      -
                    </Button>
                    <span className="min-w-8 text-center text-sm font-bold text-white">
                      {item.quantity}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={isMutating}
                      className="px-3 py-2"
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => removeCartItem(item.id)}
                      disabled={isMutating}
                      className="ml-2 px-3 py-2"
                    >
                      Quitar
                    </Button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl">
              <h2 className="text-lg font-bold text-white">Resumen</h2>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{cart?.totalItem ?? 0}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${(cart?.totalPrice ?? 0).toFixed(2)}</span>
                </p>
                <p className="flex items-center justify-between text-emerald-300">
                  <span>Descuento</span>
                  <span>-${(cart?.discounte ?? 0).toFixed(2)}</span>
                </p>
                <p className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-base font-black text-white">
                  <span>Total</span>
                  <span>${(cart?.totalDiscountedPrice ?? 0).toFixed(2)}</span>
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Continuar al checkout
              </Link>
            </aside>
          </div>
        )}
      </PageLayout>
    </AuthGuard>
  );
}
