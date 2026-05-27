import { apiService } from "@/services/api.service";
import type {
  AddItemRequest,
  Cart,
  CartItem,
  UpdateCartItemRequest,
} from "@/models/cart.model";
import type { ApiResponse } from "@/types/api-response.type";

export const cartService = {
  getCart(): Promise<Cart> {
    return apiService.get<Cart>("/cart/");
  },

  addItem(data: AddItemRequest): Promise<CartItem> {
    return apiService.put<CartItem>("/cart/add", data);
  },

  updateItem(
    cartItemId: number | string,
    data: UpdateCartItemRequest
  ): Promise<CartItem> {
    return apiService.put<CartItem>(`/cart_items/${cartItemId}`, data);
  },

  removeItem(cartItemId: number | string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(`/cart_items/${cartItemId}`);
  },
};