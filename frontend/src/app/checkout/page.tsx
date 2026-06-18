"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthGuard } from "@/guards/AuthGuard";
import type { CreateOrderRequest, PaymentMethod } from "@/models/order.model";
import { orderService } from "@/services/order.service";
import { useCart } from "@/hooks/useCart";
import type { CheckoutField, FieldErrors } from "@/utils/validation.util";
import {
  getErrorMessage,
  hasFormErrors,
  validateCheckoutForm,
} from "@/utils/validation.util";

interface CheckoutFormState {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
  cardholderName: string;
  cardNumber: string;
  paymentMethod: PaymentMethod;
}

const INITIAL_FORM: CheckoutFormState = {
  firstName: "",
  lastName: "",
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  mobile: "",
  cardholderName: "",
  cardNumber: "",
  paymentMethod: "CREDIT_CARD",
};

export default function CheckoutPage() {
  const { cart, clearCart, isMutating } = useCart();
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CheckoutField>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCartEmpty = !cart || cart.cartItems.length === 0;

  const onFieldChange =
  (field: keyof CheckoutFormState) =>
  (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));

    if (field !== "paymentMethod") {
      setFieldErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (isCartEmpty) {
      setError("Tu carrito está vacío. Agrega productos antes de pagar.");
      return;
    }

    const nextErrors = validateCheckoutForm(form);
setFieldErrors(nextErrors);

if (hasFormErrors(nextErrors)) {
  setError("Revisa los datos marcados antes de continuar.");
  return;
}

    const payload: CreateOrderRequest = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      streetAddress: form.streetAddress.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      mobile: form.mobile.trim(),
      paymentMethod: form.paymentMethod,
      cardholderName: form.cardholderName.trim(),
      cardNumber: form.cardNumber.replace(/\s/g, ""),
    };

    try {
      setIsSubmitting(true);
      const createdOrder = await orderService.createOrder(payload);
      await clearCart();
      setSuccess(
        `Pago simulado exitoso. Orden #${createdOrder.id} creada correctamente.`
      );
      setForm(INITIAL_FORM);
    } catch (requestError) {
  setError(
    getErrorMessage(requestError, "No se pudo procesar el checkout.")
  );
} finally {
  setIsSubmitting(false);
}
  };

  return (
    <AuthGuard>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_340px]">
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
          <h1 className="text-2xl font-black text-white">Checkout</h1>
          <p className="mt-2 text-sm text-slate-300">
            Completa tus datos de envío y simula tu pago.
          </p>

          <div className="mt-5 space-y-3">
            {error && <Alert message={error} type="error" />}
            {success && <Alert message={success} type="success" />}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                name="firstName"
                value={form.firstName}
                onChange={onFieldChange("firstName")}
                error={fieldErrors.firstName ?? null}
              />
              <Input
                label="Apellido"
                name="lastName"
                value={form.lastName}
                onChange={onFieldChange("lastName")}
                error={fieldErrors.lastName ?? null}
              />
            </div>

            <Input
              label="Dirección"
              name="streetAddress"
              value={form.streetAddress}
              onChange={onFieldChange("streetAddress")}
              error={fieldErrors.streetAddress ?? null}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Ciudad"
                name="city"
                value={form.city}
                onChange={onFieldChange("city")}
                error={fieldErrors.city ?? null}
              />
              <Input
                label="Departamento/Estado"
                name="state"
                value={form.state}
                onChange={onFieldChange("state")}
                error={fieldErrors.state ?? null}
              />
              <Input
                label="Código postal"
                name="zipCode"
                value={form.zipCode}
                onChange={onFieldChange("zipCode")}
                error={fieldErrors.zipCode ?? null}
              />
            </div>

            <Input
              label="Teléfono"
              name="mobile"
              value={form.mobile}
              onChange={onFieldChange("mobile")}
              error={fieldErrors.mobile ?? null}
            />

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                Pago simulado
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Titular de tarjeta"
                  name="cardholderName"
                  value={form.cardholderName}
                  onChange={onFieldChange("cardholderName")}
                  error={fieldErrors.cardholderName ?? null}
                />
                <Input
                  label="Número de tarjeta"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={onFieldChange("cardNumber")}
                  error={fieldErrors.cardNumber ?? null}
                />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <label htmlFor="paymentMethod" className="text-sm font-medium text-slate-200">
                  Método de pago
                </label>
                <select
                  id="paymentMethod"
                  value={form.paymentMethod}
                  onChange={onFieldChange("paymentMethod")}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
                >
                  <option className="text-slate-950" value="CREDIT_CARD">
                    Tarjeta de crédito
                  </option>
                  <option className="text-slate-950" value="DEBIT_CARD">
                    Tarjeta de débito
                  </option>
                  <option className="text-slate-950" value="PAYPAL">
                    PayPal
                  </option>
                  <option className="text-slate-950" value="GOOGLE_PAY">
                    Google Pay
                  </option>
                  <option className="text-slate-950" value="UPI">
                    UPI
                  </option>
                  <option className="text-slate-950" value="NET_BANKING">
                    Net Banking
                  </option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isCartEmpty || isSubmitting || isMutating}
              className="w-full sm:w-auto"
            >
              Confirmar compra
            </Button>
          </form>
        </section>

        <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-xl">
          <h2 className="text-lg font-bold text-white">Resumen de compra</h2>

          {isCartEmpty ? (
            <div className="mt-4">
              <p className="text-sm text-slate-300">No hay productos en tu carrito.</p>
              <Link
                href="/products"
                className="mt-4 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Ir a productos
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                {cart.cartItems.map((item) => (
                  <p key={item.id} className="flex items-center justify-between gap-3">
                    <span className="line-clamp-1">
                      {item.product.title} x{item.quantity}
                    </span>
                    <span>${item.discountedPrice.toFixed(2)}</span>
                  </p>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-300">
                <p className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </p>
                <p className="flex items-center justify-between text-emerald-300">
                  <span>Descuento</span>
                  <span>-${cart.discounte.toFixed(2)}</span>
                </p>
                <p className="flex items-center justify-between text-base font-black text-white">
                  <span>Total</span>
                  <span>${cart.totalDiscountedPrice.toFixed(2)}</span>
                </p>
              </div>
            </>
          )}
        </aside>
      </main>
    </AuthGuard>
  );
}

