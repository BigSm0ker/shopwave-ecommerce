"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/guards/AuthGuard";
import PageLayout from "@/components/layout/PageLayout";
import { orderService } from "@/services/order.service";
import type { Order, OrderItem, OrderStatus } from "@/models/order.model";

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await orderService.getUserOrders();

        // Ordenamos por fecha descendente (las más recientes primero) usando createdAt u orderDate
        const sortedOrders = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setOrders(sortedOrders);
      } catch (err) {
        setError("No se pudo cargar tu historial de compras.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Mapeo estricto utilizando los estados definidos en el tipo OrderStatus
  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<
      OrderStatus,
      { bg: string; text: string; label: string }
    > = {
      PENDING: { bg: "#FEF3C7", text: "#D97706", label: "Pendiente" },
      PLACED: { bg: "#EEF2F6", text: "#64748B", label: "Recibido" },
      CONFIRMED: { bg: "#E0F2FE", text: "#0369A1", label: "Confirmado" },
      SHIPPED: { bg: "#DBEAFE", text: "#2563EB", label: "Enviado" },
      DELIVERED: { bg: "#D1FAE5", text: "#059669", label: "Entregado" },
      CANCELLED: { bg: "#FEE2E2", text: "#DC2626", label: "Cancelado" },
    };

    const current = styles[status] || styles.PENDING;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: current.bg, color: current.text }}
      >
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p
          className="font-semibold animate-pulse"
          style={{ color: "var(--foreground)" }}
        >
          Cargando historial de órdenes...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <h1
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--foreground)" }}
      >
        Mis Compras
      </h1>
      <p
        className="mb-8 text-sm"
        style={{ color: "var(--foreground)", opacity: 0.8 }}
      >
        Revisa el estado de tus pedidos y el histórico de tus transacciones.
      </p>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-800 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border border-dashed p-8"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-lg font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Aún no has realizado ninguna compra.
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            ¡Explora nuestro catálogo y realiza tu primer pedido!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA: Lista de Órdenes */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                  selectedOrder?.id === order.id
                    ? "ring-2 ring-[var(--primary)]"
                    : ""
                }`}
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span
                      className="text-xs font-mono block opacity-60"
                      style={{ color: "var(--foreground)" }}
                    >
                      ID: {order.orderId || order.id}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "Fecha no registrada"}
                    </span>
                  </div>
                  {getStatusBadge(order.orderStatus)}
                </div>

                <div
                  className="flex items-center justify-between pt-2 border-t border-dashed"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-xs opacity-70"
                    style={{ color: "var(--foreground)" }}
                  >
                    {order.totalItem || order.orderItems?.length || 0} artículos
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    $
                    {(order.totalDiscountedPrice || order.totalPrice).toFixed(
                      2,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Detalle de la Orden Seleccionada */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div
                className="p-6 rounded-2xl border shadow-sm sticky top-6 space-y-6"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Detalle del Pedido
                  </h2>
                  <p
                    className="text-xs font-mono opacity-60 mt-1"
                    style={{ color: "var(--foreground)" }}
                  >
                    Ref: {selectedOrder.orderId || selectedOrder.id}
                  </p>
                </div>

                {/* Resumen de Productos */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {selectedOrder.orderItems?.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm py-1 border-b last:border-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="max-w-[70%]">
                        <p
                          className="font-medium truncate"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.product?.title || "Producto sin título"}
                        </p>
                        <p
                          className="text-xs opacity-60"
                          style={{ color: "var(--foreground)" }}
                        >
                          Cant: {item.quantity}{" "}
                          {item.size ? `(Talla: ${item.size})` : ""}
                        </p>
                      </div>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--foreground)" }}
                      >
                        $
                        {(
                          item.discountedPrice || item.price * item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Datos de Entrega desde shippingAddress */}
                {selectedOrder.shippingAddress && (
                  <div
                    className="pt-2 border-t space-y-2 text-xs"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <p className="font-bold text-sm">Dirección de Envío:</p>
                    <p className="opacity-90">
                      {selectedOrder.shippingAddress.firstName}{" "}
                      {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p className="opacity-90">
                      {selectedOrder.shippingAddress.streetAddress}
                    </p>
                    <p className="opacity-90">
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}
                    </p>
                    <p className="opacity-90">
                      Tel: {selectedOrder.shippingAddress.mobile}
                    </p>
                  </div>
                )}

                {/* Totalizador */}
                <div
                  className="pt-4 border-t flex items-center justify-between"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Total Pagado:
                  </span>
                  <span
                    className="text-xl font-black"
                    style={{ color: "var(--primary)" }}
                  >
                    $
                    {(
                      selectedOrder.totalDiscountedPrice ||
                      selectedOrder.totalPrice
                    ).toFixed(2)}
                  </span>
                </div>

                {selectedOrder.paymentDetails?.paymentMethod && (
                  <div
                    className="text-xs text-center uppercase tracking-wider font-bold p-2 rounded-lg bg-slate-50"
                    style={{ color: "var(--foreground)", opacity: 0.7 }}
                  >
                    Pago:{" "}
                    {selectedOrder.paymentDetails.paymentMethod.replace(
                      "_",
                      " ",
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="p-6 rounded-2xl border border-dashed text-center py-12 sticky top-6"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  opacity: 0.6,
                }}
              >
                <p className="text-sm">
                  Selecciona una orden de la lista para ver su desglose
                  detallado.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <PageLayout>
        <OrdersContent />
      </PageLayout>
    </AuthGuard>
  );
}
