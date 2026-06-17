"use client";

import { useEffect, useState, useMemo } from "react";
import { AdminGuard } from "@/guards/AdminGuard";
import PageLayout from "@/components/layout/PageLayout";
import { orderService } from "@/services/order.service";
import type { Order, OrderItem, OrderStatus } from "@/models/order.model";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { 
  Search, 
  Trash2, 
  Check, 
  Truck, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  MapPin,
  CreditCard,
  X,
  Calendar,
  Layers,
  TrendingUp,
  DollarSign
} from "lucide-react";

// MOCK DATA en caso de que la API falle o no tenga registros
const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    orderId: "SW-2026-9812",
    createdAt: "2026-06-17T10:15:30.000Z",
    orderDate: "2026-06-17T10:15:30.000Z",
    orderStatus: "PENDING",
    totalPrice: 139.97,
    totalDiscountedPrice: 139.97,
    discounte: 0,
    totalItem: 3,
    user: {
      id: 101,
      firstName: "Juan",
      lastName: "Perez",
      email: "juan.perez@example.com",
      mobile: "+59170000000",
      role: "ROLE_USER"
    },
    shippingAddress: {
      firstName: "Juan",
      lastName: "Perez",
      streetAddress: "Av. Siempre Viva 123",
      city: "La Paz",
      state: "La Paz",
      zipCode: "0001",
      mobile: "+59170000000"
    },
    paymentDetails: {
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
      cardholderName: "JUAN PEREZ",
      cardNumber: "************4111"
    },
    orderItems: [
      {
        id: 10,
        size: "L",
        quantity: 2,
        price: 59.99,
        discountedPrice: 59.99,
        product: {
          id: 51,
          title: "Sudadera Oversize Minimalista",
          description: "Sudadera de algodón orgánico con corte relajado unisex.",
          price: 59.99,
          discountedPrice: 59.99,
          discountPersent: 0,
          quantity: 25,
          brand: "Shopwave",
          color: "Negro Carbono",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300",
          category: { id: 1, name: "Hoodies", level: 1 }
        }
      },
      {
        id: 11,
        size: "Unico",
        quantity: 1,
        price: 19.99,
        discountedPrice: 19.99,
        product: {
          id: 52,
          title: "Bolso Tote de Lona",
          description: "Bolso resistente hecho 100% de lona de algodón reciclado.",
          price: 19.99,
          discountedPrice: 19.99,
          discountPersent: 0,
          quantity: 50,
          brand: "Shopwave",
          color: "Crudo",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300",
          category: { id: 2, name: "Accesorios", level: 1 }
        }
      }
    ]
  },
  {
    id: 2,
    orderId: "SW-2026-9813",
    createdAt: "2026-06-16T15:20:00.000Z",
    orderDate: "2026-06-16T15:20:00.000Z",
    orderStatus: "CONFIRMED",
    totalPrice: 79.98,
    totalDiscountedPrice: 79.98,
    discounte: 0,
    totalItem: 2,
    user: {
      id: 102,
      firstName: "María",
      lastName: "Gómez",
      email: "maria.gomez@example.com",
      mobile: "+59172223344",
      role: "ROLE_USER"
    },
    shippingAddress: {
      firstName: "María",
      lastName: "Gómez",
      streetAddress: "Calle Obrajes 456",
      city: "La Paz",
      state: "La Paz",
      zipCode: "0002",
      mobile: "+59172223344"
    },
    paymentDetails: {
      paymentMethod: "DEBIT_CARD",
      status: "COMPLETED",
      cardholderName: "MARIA GOMEZ",
      cardNumber: "************5234"
    },
    orderItems: [
      {
        id: 12,
        size: "M",
        quantity: 1,
        price: 29.99,
        discountedPrice: 29.99,
        product: {
          id: 53,
          title: "Camiseta Algodón Premium",
          description: "Camiseta de corte clásico confeccionada en algodón pima.",
          price: 29.99,
          discountedPrice: 29.99,
          discountPersent: 0,
          quantity: 100,
          brand: "Shopwave",
          color: "Blanco Off-White",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300",
          category: { id: 3, name: "T-Shirts", level: 1 }
        }
      },
      {
        id: 13,
        size: "M",
        quantity: 1,
        price: 49.99,
        discountedPrice: 49.99,
        product: {
          id: 54,
          title: "Pantalón Jogger Relajado",
          description: "Pantalón cómodo con cintura elástica y puños ajustados.",
          price: 49.99,
          discountedPrice: 49.99,
          discountPersent: 0,
          quantity: 40,
          brand: "Shopwave",
          color: "Gris Melange",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=300",
          category: { id: 4, name: "Pants", level: 1 }
        }
      }
    ]
  },
  {
    id: 3,
    orderId: "SW-2026-9814",
    createdAt: "2026-06-15T09:44:12.000Z",
    orderDate: "2026-06-15T09:44:12.000Z",
    orderStatus: "SHIPPED",
    totalPrice: 89.99,
    totalDiscountedPrice: 89.99,
    discounte: 0,
    totalItem: 1,
    user: {
      id: 103,
      firstName: "Carlos",
      lastName: "Rodríguez",
      email: "carlos.rod@example.com",
      mobile: "+59168889900",
      role: "ROLE_USER"
    },
    shippingAddress: {
      firstName: "Carlos",
      lastName: "Rodríguez",
      streetAddress: "Av. Melchor Pinto 789",
      city: "Santa Cruz",
      state: "Santa Cruz",
      zipCode: "0003",
      mobile: "+59168889900"
    },
    paymentDetails: {
      paymentMethod: "PAYPAL",
      status: "COMPLETED",
      cardholderName: "CARLOS RODRIGUEZ",
      cardNumber: "Paypal: carlos.rod@example.com"
    },
    orderItems: [
      {
        id: 14,
        size: "XL",
        quantity: 1,
        price: 89.99,
        discountedPrice: 89.99,
        product: {
          id: 55,
          title: "Chaqueta Denim Clásica",
          description: "Chaqueta vaquera resistente unisex con botones metálicos.",
          price: 89.99,
          discountedPrice: 89.99,
          discountPersent: 0,
          quantity: 15,
          brand: "Shopwave",
          color: "Azul Índigo",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=300",
          category: { id: 5, name: "Jackets", level: 1 }
        }
      }
    ]
  },
  {
    id: 4,
    orderId: "SW-2026-9815",
    createdAt: "2026-06-12T18:00:22.000Z",
    orderDate: "2026-06-12T18:00:22.000Z",
    orderStatus: "DELIVERED",
    totalPrice: 99.98,
    totalDiscountedPrice: 99.98,
    discounte: 0,
    totalItem: 2,
    user: {
      id: 104,
      firstName: "Ana",
      lastName: "Martínez",
      email: "ana.mtz@example.com",
      mobile: "+59171112233",
      role: "ROLE_USER"
    },
    shippingAddress: {
      firstName: "Ana",
      lastName: "Martínez",
      streetAddress: "Calle Tarija 12",
      city: "Cochabamba",
      state: "Cochabamba",
      zipCode: "0004",
      mobile: "+59171112233"
    },
    paymentDetails: {
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
      cardholderName: "ANA MARTINEZ",
      cardNumber: "************9988"
    },
    orderItems: [
      {
        id: 15,
        size: "Unico",
        quantity: 1,
        price: 39.99,
        discountedPrice: 39.99,
        product: {
          id: 56,
          title: "Billetera de Cuero Vegano",
          description: "Billetera minimalista con protección RFID hecha de poliuretano reciclado.",
          price: 39.99,
          discountedPrice: 39.99,
          discountPersent: 0,
          quantity: 30,
          brand: "Shopwave",
          color: "Marrón Tabaco",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1627124765135-565518344314?q=80&w=300",
          category: { id: 2, name: "Accesorios", level: 1 }
        }
      },
      {
        id: 16,
        size: "S",
        quantity: 1,
        price: 59.99,
        discountedPrice: 59.99,
        product: {
          id: 51,
          title: "Sudadera Oversize Minimalista",
          description: "Sudadera de algodón orgánico con corte relajado unisex.",
          price: 59.99,
          discountedPrice: 59.99,
          discountPersent: 0,
          quantity: 25,
          brand: "Shopwave",
          color: "Negro Carbono",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300",
          category: { id: 1, name: "Hoodies", level: 1 }
        }
      }
    ]
  },
  {
    id: 5,
    orderId: "SW-2026-9816",
    createdAt: "2026-06-10T14:30:10.000Z",
    orderDate: "2026-06-10T14:30:10.000Z",
    orderStatus: "CANCELLED",
    totalPrice: 89.97,
    totalDiscountedPrice: 89.97,
    discounte: 0,
    totalItem: 3,
    user: {
      id: 105,
      firstName: "Luis",
      lastName: "Flores",
      email: "luis.flores@example.com",
      mobile: "+59178881122",
      role: "ROLE_USER"
    },
    shippingAddress: {
      firstName: "Luis",
      lastName: "Flores",
      streetAddress: "Calle Potosí 100",
      city: "Oruro",
      state: "Oruro",
      zipCode: "0005",
      mobile: "+59178881122"
    },
    paymentDetails: {
      paymentMethod: "GOOGLE_PAY",
      status: "FAILED",
      cardholderName: "LUIS FLORES",
      cardNumber: "GPay Account"
    },
    orderItems: [
      {
        id: 17,
        size: "L",
        quantity: 3,
        price: 29.99,
        discountedPrice: 29.99,
        product: {
          id: 53,
          title: "Camiseta Algodón Premium",
          description: "Camiseta de corte clásico confeccionada en algodón pima.",
          price: 29.99,
          discountedPrice: 29.99,
          discountPersent: 0,
          quantity: 100,
          brand: "Shopwave",
          color: "Blanco Off-White",
          sizes: [],
          imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300",
          category: { id: 3, name: "T-Shirts", level: 1 }
        }
      }
    ]
  }
];

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | string | null>(null);

  // Carga inicial de datos
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.adminGetAllOrders();
      
      // Ordenamos por fecha descendente
      const sorted = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
      setOrders(sorted);
      setIsSimulated(false);
    } catch (err) {
      console.warn("Error cargando órdenes reales del backend. Cargando simulación...", err);
      // Fallback a simulación
      setOrders(MOCK_ORDERS);
      setIsSimulated(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const pendingCount = orders.filter(o => o.orderStatus === "PENDING").length;
    const shippedCount = orders.filter(o => o.orderStatus === "SHIPPED").length;
    const cancelledCount = orders.filter(o => o.orderStatus === "CANCELLED").length;
    
    // Sumamos las ventas de órdenes que no estén canceladas
    const totalSales = orders
      .filter(o => o.orderStatus !== "CANCELLED")
      .reduce((sum, o) => sum + (o.totalDiscountedPrice || o.totalPrice), 0);

    return {
      totalCount,
      pendingCount,
      shippedCount,
      cancelledCount,
      totalSales
    };
  }, [orders]);

  // Filtrado y búsqueda
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filtro de estado
      if (statusFilter !== "ALL" && order.orderStatus !== statusFilter) {
        return false;
      }
      
      // Búsqueda por texto (ID, Cliente, Email)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const idMatch = (order.orderId || String(order.id)).toLowerCase().includes(query);
        const nameMatch = order.user
          ? `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(query)
          : order.shippingAddress 
            ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(query)
            : "";
        const emailMatch = order.user?.email?.toLowerCase().includes(query) || false;
        
        return idMatch || nameMatch || emailMatch;
      }
      
      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Cambiar estado de la orden
  const handleUpdateStatus = async (orderId: number | string, currentStatus: OrderStatus, action: "confirm" | "ship" | "deliver" | "cancel") => {
    setActionLoadingId(orderId);
    try {
      let updatedOrder: Order;

      if (isSimulated) {
        // En simulación lo hacemos en memoria
        await new Promise(resolve => setTimeout(resolve, 600)); // Simula latencia
        
        const nextStatusMap: Record<typeof action, OrderStatus> = {
          confirm: "CONFIRMED",
          ship: "SHIPPED",
          deliver: "DELIVERED",
          cancel: "CANCELLED"
        };
        
        const targetOrder = orders.find(o => o.id === orderId || o.orderId === orderId);
        if (!targetOrder) throw new Error("Orden no encontrada");

        updatedOrder = {
          ...targetOrder,
          orderStatus: nextStatusMap[action],
          deliveryDate: action === "deliver" ? new Date().toISOString() : targetOrder.deliveryDate
        };
      } else {
        // Petición real al API
        if (action === "confirm") {
          updatedOrder = await orderService.adminConfirmOrder(orderId);
        } else if (action === "ship") {
          updatedOrder = await orderService.adminShipOrder(orderId);
        } else if (action === "deliver") {
          updatedOrder = await orderService.adminDeliverOrder(orderId);
        } else {
          updatedOrder = await orderService.adminCancelOrder(orderId);
        }
      }

      // Actualizar estado local
      setOrders(current => current.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, ...updatedOrder } : o));
      
      // Actualizar el modal si está abierto
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder(prev => prev ? { ...prev, ...updatedOrder } : null);
      }
    } catch (err) {
      alert("Error al actualizar el estado de la orden.");
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Eliminar orden
  const handleDeleteOrder = async (orderId: number | string) => {
    const confirmed = window.confirm("¿Estás completamente seguro de que deseas eliminar este pedido permanentemente?");
    if (!confirmed) return;

    setActionLoadingId(orderId);
    try {
      if (isSimulated) {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        await orderService.adminDeleteOrder(orderId);
      }

      setOrders(current => current.filter(o => o.id !== orderId && o.orderId !== orderId));
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder(null);
      }
    } catch (err) {
      alert("Error al eliminar la orden.");
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Badge de estado personalizado
  const renderStatusBadge = (status: OrderStatus) => {
    const config: Record<OrderStatus, { bg: string; border: string; text: string; label: string }> = {
      PENDING: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", label: "Pendiente" },
      PLACED: { bg: "bg-slate-500/10", border: "border-slate-500/20", text: "text-slate-400", label: "Recibido" },
      CONFIRMED: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400", label: "Confirmado" },
      SHIPPED: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", label: "Enviado" },
      DELIVERED: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: "Entregado" },
      CANCELLED: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", label: "Cancelado" },
    };

    const style = config[status] || config.PENDING;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.border} ${style.text}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
        {style.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      
      {/* Encabezado */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Panel Admin
            </p>
            {isSimulated && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 animate-pulse">
                <AlertTriangle size={10} />
                MODO SIMULACIÓN (API OFFLINE)
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Gestión de Pedidos</h1>
          <p className="text-sm text-slate-400">Supervisa las compras del e-commerce y gestiona los estados de despacho.</p>
        </div>
        <Button type="button" onClick={fetchOrders} className="w-fit">
          Refrescar Datos
        </Button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Ventas */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-cyan-500/5 transition-transform group-hover:scale-110">
            <DollarSign size={96} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              <TrendingUp size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Netas</p>
          </div>
          <p className="mt-4 text-2xl font-black text-white">${stats.totalSales.toFixed(2)}</p>
          <p className="mt-1 text-[10px] text-slate-400">Excluye pedidos cancelados</p>
        </div>

        {/* Total Órdenes */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-slate-400/5 transition-transform group-hover:scale-110">
            <ShoppingBag size={96} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-400 border border-slate-500/20">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pedidos Totales</p>
          </div>
          <p className="mt-4 text-2xl font-black text-white">{stats.totalCount}</p>
          <p className="mt-1 text-[10px] text-slate-400">Registrados en total</p>
        </div>

        {/* Pendientes */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-500/5 transition-transform group-hover:scale-110">
            <Clock size={96} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Por Confirmar</p>
          </div>
          <p className="mt-4 text-2xl font-black text-white">{stats.pendingCount}</p>
          <p className="mt-1 text-[10px] text-slate-400">Requieren atención inmediata</p>
        </div>

        {/* Enviadas */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-blue-500/5 transition-transform group-hover:scale-110">
            <Truck size={96} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Truck size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En Tránsito</p>
          </div>
          <p className="mt-4 text-2xl font-black text-white">{stats.shippedCount}</p>
          <p className="mt-1 text-[10px] text-slate-400">En ruta de entrega</p>
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-slate-900/40 p-4 rounded-3xl border border-white/5">
        
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por ID de orden, cliente o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white/10 bg-slate-950/60 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tabs de Filtro de Estado */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { value: "ALL", label: "Todos" },
            { value: "PENDING", label: "Pendientes" },
            { value: "CONFIRMED", label: "Confirmados" },
            { value: "SHIPPED", label: "Enviados" },
            { value: "DELIVERED", label: "Entregados" },
            { value: "CANCELLED", label: "Cancelados" }
          ].map(tab => {
            const count = tab.value === "ALL" 
              ? orders.length 
              : orders.filter(o => o.orderStatus === tab.value).length;
              
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  statusFilter === tab.value
                    ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/10"
                    : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab.label} <span className="opacity-60 ml-1 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado / Tabla de Órdenes */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl overflow-hidden backdrop-blur-sm">
        
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400"></div>
            </div>
            <p className="text-sm text-slate-300 animate-pulse font-medium">Obteniendo listado de órdenes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <ShoppingBag className="mx-auto text-slate-500 mb-3" size={40} />
            <h3 className="text-lg font-bold text-white">No se encontraron órdenes</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              {searchQuery ? "Intenta con otros términos de búsqueda." : "No hay órdenes registradas con este filtro."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">ID Pedido</th>
                  <th className="py-4 px-6">Fecha</th>
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6 text-center">Artículos</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-center">Despacho</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredOrders.map(order => {
                  const itemsCount = order.totalItem || order.orderItems?.length || 0;
                  const formattedDate = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "N/A";
                    
                  const clientName = order.user 
                    ? `${order.user.firstName} ${order.user.lastName}` 
                    : order.shippingAddress 
                      ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                      : "Cliente Anónimo";
                      
                  const clientEmail = order.user?.email || "Sin correo";
                  const isActionPending = actionLoadingId === order.id || actionLoadingId === order.orderId;

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-white/5 transition-colors cursor-pointer group/row`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* ID Pedido */}
                      <td className="py-4 px-6 font-mono text-xs text-white group-hover/row:text-cyan-300 transition-colors">
                        {order.orderId || order.id}
                      </td>

                      {/* Fecha */}
                      <td className="py-4 px-6 whitespace-nowrap text-xs">
                        {formattedDate}
                      </td>

                      {/* Cliente */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{clientName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{clientEmail}</div>
                      </td>

                      {/* Artículos */}
                      <td className="py-4 px-6 text-center font-bold font-mono text-white">
                        {itemsCount}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 font-bold text-cyan-400">
                        ${(order.totalDiscountedPrice || order.totalPrice).toFixed(2)}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(order.orderStatus)}
                      </td>

                      {/* Despacho rápido */}
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          {order.orderStatus === "PENDING" && (
                            <>
                              <button
                                title="Confirmar Pedido"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "PENDING", "confirm")}
                                className="flex h-7 w-7 items-center justify-center rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white border border-sky-500/20 transition active:scale-95 disabled:opacity-50"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                title="Cancelar Pedido"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "PENDING", "cancel")}
                                className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition active:scale-95 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}

                          {order.orderStatus === "CONFIRMED" && (
                            <>
                              <button
                                title="Despachar/Enviar Pedido"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "CONFIRMED", "ship")}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 transition text-xs font-bold active:scale-95 disabled:opacity-50"
                              >
                                <Truck size={12} />
                                Enviar
                              </button>
                              <button
                                title="Cancelar Pedido"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "CONFIRMED", "cancel")}
                                className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition active:scale-95 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}

                          {order.orderStatus === "SHIPPED" && (
                            <>
                              <button
                                title="Marcar como Entregado"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "SHIPPED", "deliver")}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition text-xs font-bold active:scale-95 disabled:opacity-50"
                              >
                                <CheckCircle size={12} />
                                Entregar
                              </button>
                              <button
                                title="Cancelar Pedido"
                                disabled={isActionPending}
                                onClick={() => handleUpdateStatus(order.id || order.orderId!, "SHIPPED", "cancel")}
                                className="flex h-7 w-7 items-center justify-center rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition active:scale-95 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}

                          {order.orderStatus === "DELIVERED" && (
                            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 justify-center py-1">
                              <CheckCircle size={12} /> Entregado
                            </span>
                          )}

                          {order.orderStatus === "CANCELLED" && (
                            <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 justify-center py-1">
                              <XCircle size={12} /> Cancelado
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Eliminar permanentemente */}
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          disabled={isActionPending}
                          onClick={() => handleDeleteOrder(order.id || order.orderId!)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 transition active:scale-90"
                          title="Eliminar registro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Drawer de Detalle Profundo */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-2xl flex flex-col text-slate-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header del Modal */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-6 py-5 backdrop-blur-md">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black text-white">Detalle de Pedido</h2>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
                    ID: {selectedOrder.orderId || selectedOrder.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Creado: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString("es-ES") : "Sin fecha registrada"}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition flex items-center justify-center hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 flex flex-col gap-6">

              {/* Barra de Progreso / Línea de tiempo */}
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Línea de tiempo de Entrega</h3>
                
                {selectedOrder.orderStatus === "CANCELLED" ? (
                  <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-sm font-semibold">
                    <XCircle size={18} />
                    <span>Este pedido ha sido cancelado por la administración.</span>
                  </div>
                ) : (
                  <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mt-2">
                    
                    {/* Línea conectora */}
                    <div className="hidden sm:block absolute left-4 right-4 top-4 h-1 bg-slate-800 -z-10 rounded">
                      <div 
                        className="h-full bg-cyan-400 transition-all duration-500 rounded" 
                        style={{ 
                          width: 
                            selectedOrder.orderStatus === "PENDING" ? "0%" :
                            selectedOrder.orderStatus === "CONFIRMED" ? "33%" :
                            selectedOrder.orderStatus === "SHIPPED" ? "66%" : "100%"
                        }}
                      />
                    </div>

                    {/* Paso 1: PENDING */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                        ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].includes(selectedOrder.orderStatus)
                          ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/20"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        <Clock size={16} />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className="text-xs font-bold text-white">Pendiente</p>
                        <p className="text-[10px] text-slate-400">Orden creada</p>
                      </div>
                    </div>

                    {/* Paso 2: CONFIRMED */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                        ["CONFIRMED", "SHIPPED", "DELIVERED"].includes(selectedOrder.orderStatus)
                          ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/20"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        <Check size={16} />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className="text-xs font-bold text-white">Confirmado</p>
                        <p className="text-[10px] text-slate-400">Verificado para envío</p>
                      </div>
                    </div>

                    {/* Paso 3: SHIPPED */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                        ["SHIPPED", "DELIVERED"].includes(selectedOrder.orderStatus)
                          ? "bg-cyan-400 text-slate-950 border-cyan-400 shadow-md shadow-cyan-400/20"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        <Truck size={16} />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className="text-xs font-bold text-white">Despachado</p>
                        <p className="text-[10px] text-slate-400">En ruta al destino</p>
                      </div>
                    </div>

                    {/* Paso 4: DELIVERED */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                        selectedOrder.orderStatus === "DELIVERED"
                          ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}>
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className="text-xs font-bold text-white">Entregado</p>
                        <p className="text-[10px] text-slate-400">Llegó al cliente</p>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Dos Columnas: Información del Cliente y Datos de Pago */}
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Info Cliente y Envío */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
                    <User size={16} className="text-cyan-400" />
                    Destinatario e Información de Envío
                  </h3>
                  
                  {selectedOrder.shippingAddress ? (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Nombre completo:</span>
                        <span className="font-semibold text-white">
                          {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs text-left">Dirección de entrega:</span>
                        <span className="font-semibold text-white text-right max-w-[70%]">
                          {selectedOrder.shippingAddress.streetAddress}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Ciudad / Región:</span>
                        <span className="font-semibold text-white">
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Código Postal:</span>
                        <span className="font-mono font-semibold text-white">
                          {selectedOrder.shippingAddress.zipCode}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Teléfono Móvil:</span>
                        <span className="font-semibold text-white">
                          {selectedOrder.shippingAddress.mobile}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No hay dirección de envío registrada para este pedido.</p>
                  )}
                </div>

                {/* Info Pago */}
                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2.5">
                    <CreditCard size={16} className="text-cyan-400" />
                    Método y Detalles de Pago
                  </h3>
                  
                  {selectedOrder.paymentDetails ? (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Plataforma / Medio:</span>
                        <span className="font-semibold text-white uppercase tracking-wide">
                          {selectedOrder.paymentDetails.paymentMethod?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-slate-400 text-xs">Estado de Transacción:</span>
                        <span className={`font-semibold ${
                          selectedOrder.paymentDetails.status === "COMPLETED" ? "text-emerald-400" :
                          selectedOrder.paymentDetails.status === "PENDING" ? "text-amber-400" : "text-rose-400"
                        }`}>
                          {selectedOrder.paymentDetails.status || "PENDING"}
                        </span>
                      </div>
                      {selectedOrder.paymentDetails.cardholderName && (
                        <div className="flex justify-between items-start">
                          <span className="text-slate-400 text-xs text-left">Titular de Tarjeta:</span>
                          <span className="font-semibold text-white uppercase text-right max-w-[70%]">
                            {selectedOrder.paymentDetails.cardholderName}
                          </span>
                        </div>
                      )}
                      {selectedOrder.paymentDetails.cardNumber && (
                        <div className="flex justify-between items-start">
                          <span className="text-slate-400 text-xs">Número / Cuenta:</span>
                          <span className="font-mono font-semibold text-white">
                            {selectedOrder.paymentDetails.cardNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No hay detalles de pago registrados.</p>
                  )}
                </div>
              </div>

              {/* Listado de Productos Pedidos */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                  <Layers size={16} className="text-cyan-400" />
                  Productos en el Pedido
                </h3>

                <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-slate-950/20">
                  {selectedOrder.orderItems?.map((item: OrderItem) => {
                    const priceToUse = item.discountedPrice || item.price;
                    const lineTotal = priceToUse * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 bg-slate-900/40 hover:bg-slate-900/80 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              className="h-16 w-16 rounded-xl object-cover border border-white/10"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 border border-white/10 text-xs">
                              Sin foto
                            </div>
                          )}
                          <div className="max-w-md">
                            <p className="font-bold text-white text-sm hover:text-cyan-300 transition-colors">
                              {item.product?.title || "Producto sin nombre"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Categoría: {item.product?.category?.name || "Básicos"} · Color: {item.product?.color || "Multicolor"}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] bg-cyan-400/10 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-400/20 uppercase">
                                Cantidad: {item.quantity}
                              </span>
                              {item.size && (
                                <span className="text-[10px] bg-white/5 text-slate-300 font-semibold px-2 py-0.5 rounded border border-white/10">
                                  Talla: {item.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                          <span className="text-xs text-slate-400 sm:hidden">Total Producto:</span>
                          <div className="text-right">
                            <p className="font-mono font-bold text-white text-base">${lineTotal.toFixed(2)}</p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                (${priceToUse.toFixed(2)} c/u)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totalizadores finales */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between border-t border-white/10 pt-5 mt-4 gap-4">
                
                {/* Acciones del Modal */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {selectedOrder.orderStatus === "PENDING" && (
                    <>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "PENDING", "confirm")}
                        className="bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-1.5 px-4"
                      >
                        <Check size={16} /> Confirmar Pedido
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "PENDING", "cancel")}
                        className="flex items-center gap-1.5 px-4"
                      >
                        <XCircle size={16} /> Cancelar Pedido
                      </Button>
                    </>
                  )}

                  {selectedOrder.orderStatus === "CONFIRMED" && (
                    <>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "CONFIRMED", "ship")}
                        className="bg-blue-500 hover:bg-blue-400 text-white flex items-center gap-1.5 px-4"
                      >
                        <Truck size={16} /> Despachar / Enviar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "CONFIRMED", "cancel")}
                        className="flex items-center gap-1.5 px-4"
                      >
                        <XCircle size={16} /> Cancelar Pedido
                      </Button>
                    </>
                  )}

                  {selectedOrder.orderStatus === "SHIPPED" && (
                    <>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "SHIPPED", "deliver")}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 px-4"
                      >
                        <CheckCircle size={16} /> Entregar Pedido
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleUpdateStatus(selectedOrder.id || selectedOrder.orderId!, "SHIPPED", "cancel")}
                        className="flex items-center gap-1.5 px-4"
                      >
                        <XCircle size={16} /> Cancelar Pedido
                      </Button>
                    </>
                  )}
                  
                  {/* Botón para eliminar en cualquier estado cancelado */}
                  {selectedOrder.orderStatus === "CANCELLED" && (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleDeleteOrder(selectedOrder.id || selectedOrder.orderId!)}
                      className="flex items-center gap-1.5 px-4 animate-pulse"
                    >
                      <Trash2 size={16} /> Eliminar Pedido Definitivo
                    </Button>
                  )}
                </div>

                {/* Precio Total */}
                <div className="text-right w-full sm:w-auto bg-slate-950/60 border border-white/10 px-6 py-3.5 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Neto Pagado</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
                    ${(selectedOrder.totalDiscountedPrice || selectedOrder.totalPrice).toFixed(2)}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <PageLayout>
        <AdminOrdersContent />
      </PageLayout>
    </AdminGuard>
  );
}
