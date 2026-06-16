"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import type { AddItemRequest, Cart } from "@/models/cart.model";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/hooks/useAuth";

interface CartContextValue {
	cart: Cart | null;
	isLoading: boolean;
	isMutating: boolean;
	error: string | null;
	itemCount: number;
	refreshCart: () => Promise<void>;
	addToCart: (payload: AddItemRequest) => Promise<void>;
	updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>;
	removeCartItem: (cartItemId: number) => Promise<void>;
	clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
	const [cart, setCart] = useState<Cart | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMutating, setIsMutating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refreshCart = useCallback(async () => {
		if (!isAuthenticated) {
			setCart(null);
			setError(null);
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			const response = await cartService.getCart();
			setCart(response);
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "No se pudo cargar el carrito."
			);
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (isAuthLoading) return;
		refreshCart();
	}, [isAuthLoading, refreshCart]);

	const addToCart = useCallback(
		async (payload: AddItemRequest) => {
			try {
				setIsMutating(true);
				setError(null);
				await cartService.addItem(payload);
				await refreshCart();
			} catch (requestError) {
				setError(
					requestError instanceof Error
						? requestError.message
						: "No se pudo agregar el producto al carrito."
				);
				throw requestError;
			} finally {
				setIsMutating(false);
			}
		},
		[refreshCart]
	);

	const updateCartItemQuantity = useCallback(
		async (cartItemId: number, quantity: number) => {
			try {
				setIsMutating(true);
				setError(null);
				await cartService.updateItem(cartItemId, { quantity });
				await refreshCart();
			} catch (requestError) {
				setError(
					requestError instanceof Error
						? requestError.message
						: "No se pudo actualizar la cantidad del producto."
				);
				throw requestError;
			} finally {
				setIsMutating(false);
			}
		},
		[refreshCart]
	);

	const removeCartItem = useCallback(
		async (cartItemId: number) => {
			try {
				setIsMutating(true);
				setError(null);
				await cartService.removeItem(cartItemId);
				await refreshCart();
			} catch (requestError) {
				setError(
					requestError instanceof Error
						? requestError.message
						: "No se pudo eliminar el producto del carrito."
				);
				throw requestError;
			} finally {
				setIsMutating(false);
			}
		},
		[refreshCart]
	);

	const clearCart = useCallback(async () => {
		if (!cart?.cartItems?.length) return;

		try {
			setIsMutating(true);
			setError(null);
			await Promise.all(cart.cartItems.map((item) => cartService.removeItem(item.id)));
			await refreshCart();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "No se pudo vaciar el carrito."
			);
			throw requestError;
		} finally {
			setIsMutating(false);
		}
	}, [cart?.cartItems, refreshCart]);

	const value = useMemo<CartContextValue>(
		() => ({
			cart,
			isLoading,
			isMutating,
			error,
			itemCount: cart?.totalItem ?? 0,
			refreshCart,
			addToCart,
			updateCartItemQuantity,
			removeCartItem,
			clearCart,
		}),
		[addToCart, cart, clearCart, error, isLoading, isMutating, refreshCart, removeCartItem, updateCartItemQuantity]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
