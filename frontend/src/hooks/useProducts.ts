"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, ProductFilters, ProductPage } from "@/models/product.model";
import { productService } from "@/services/product.service";

interface UseProductsState {
  products: Product[];
  product: Product | null;
  productPage: ProductPage | null;
  loading: boolean;
  error: string | null;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error al obtener los productos.";
};

export const useProducts = () => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    product: null,
    productPage: null,
    loading: false,
    error: null,
  });

  const getProducts = useCallback(async () => {
    try {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const products = await productService.getProducts();

      setState((previous) => ({
        ...previous,
        products,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const getProductsPage = useCallback(async (filters?: ProductFilters) => {
    try {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const productPage = await productService.getProductsPage(filters);

      setState((previous) => ({
        ...previous,
        productPage,
        products: productPage.content,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const getProductById = useCallback(async (productId: number | string) => {
    try {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const product = await productService.getProductById(productId);

      setState((previous) => ({
        ...previous,
        product,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    try {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const products = await productService.searchProducts(query);

      setState((previous) => ({
        ...previous,
        products,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: getErrorMessage(error),
      }));
    }
  }, []);

  const clearSelectedProduct = () => {
    setState((previous) => ({
      ...previous,
      product: null,
    }));
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products: state.products,
    product: state.product,
    productPage: state.productPage,
    loading: state.loading,
    error: state.error,
    getProducts,
    getProductsPage,
    getProductById,
    searchProducts,
    clearSelectedProduct,
  };
};