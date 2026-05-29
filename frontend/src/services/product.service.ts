import { apiService } from "@/services/api.service";
import type {
  CreateProductRequest,
  Product,
  ProductFilters,
  ProductPage,
} from "@/models/product.model";
import type { ApiResponse } from "@/types/api-response.type";

const buildProductQuery = (filters?: ProductFilters): string => {
  if (!filters) return "";

  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minDiscount !== undefined) params.set("minDiscount", String(filters.minDiscount));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.stock) params.set("stock", filters.stock);
  if (filters.pageNumber !== undefined) params.set("pageNumber", String(filters.pageNumber));
  if (filters.pageSize !== undefined) params.set("pageSize", String(filters.pageSize));

  filters.colors?.forEach((color) => params.append("colors", color));
  filters.sizes?.forEach((size) => params.append("sizes", size));

  const query = params.toString();

  return query ? `?${query}` : "";
};

export const productService = {
  getProducts(): Promise<Product[]> {
    return apiService.get<Product[]>("/products", { auth: false });
  },

  getProductsPage(filters?: ProductFilters): Promise<ProductPage> {
    const query = buildProductQuery(filters);

    return apiService.get<ProductPage>(`/products/all${query}`, { auth: false });
  },

  getProductById(productId: number | string): Promise<Product> {
    return apiService.get<Product>(`/products/${productId}`, { auth: false });
  },

  searchProducts(query: string): Promise<Product[]> {
    const params = new URLSearchParams({ q: query });

    return apiService.get<Product[]>(
      `/products/search?${params.toString()}`,
      { auth: false }
    );
  },

  createProduct(data: CreateProductRequest): Promise<Product> {
    return apiService.post<Product>("/admin/products/", data);
  },

  createMultipleProducts(data: CreateProductRequest[]): Promise<ApiResponse<null>> {
    return apiService.post<ApiResponse<null>>("/admin/products/creates", data);
  },

  updateProduct(
    productId: number | string,
    data: Partial<Product>
  ): Promise<Product> {
    return apiService.put<Product>(`/admin/products/${productId}/update`, data);
  },

  deleteProduct(productId: number | string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(
      `/admin/products/${productId}/delete`
    );
  },
};