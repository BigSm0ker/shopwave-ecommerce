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
};