import { apiService } from "@/services/api.service";
import type { CreateOrderRequest, Order } from "@/models/order.model";

export const orderService = {
  createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiService.post<Order>("/orders/", data);
  },

  getUserOrders(): Promise<Order[]> {
    return apiService.get<Order[]>("/orders/user");
  },

  getOrderById(orderId: number | string): Promise<Order> {
    return apiService.get<Order>(`/orders/${orderId}`);
  },

  adminGetAllOrders(): Promise<Order[]> {
    return apiService.get<Order[]>("/admin/orders/");
  },

  adminConfirmOrder(orderId: number | string): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${orderId}/confirmed`);
  },

  adminShipOrder(orderId: number | string): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${orderId}/ship`);
  },

  adminDeliverOrder(orderId: number | string): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${orderId}/deliver`);
  },

  adminCancelOrder(orderId: number | string): Promise<Order> {
    return apiService.put<Order>(`/admin/orders/${orderId}/cancel`);
  },

  adminDeleteOrder(orderId: number | string): Promise<{ message: string; status: boolean }> {
    return apiService.delete<{ message: string; status: boolean }>(`/admin/orders/${orderId}/delete`);
  },
};