"use client";

import React, { useState } from "react";
import { cartService } from "@/services/cart.service";
import type { Size } from "@/models/product.model";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";

interface ProductActionsProps {
  productId: number;
  price: number;
  discountedPrice: number;
  sizes: Size[];
  stockQuantity: number;
}

export default function ProductActions({
  productId,
  price,
  discountedPrice,
  sizes = [],
  stockQuantity,
}: ProductActionsProps) {
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // We filter sizes that are actually available (quantity > 0)
  const availableSizes = sizes.filter((s) => s.quantity > 0);
  const needsSizeSelection = availableSizes.length > 0;

  const handleAddToCart = async () => {
    setError(null);
    setSuccess(null);

    if (!isAuthenticated) {
      setError("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (needsSizeSelection && !selectedSize) {
      setError("Por favor, selecciona una talla antes de añadir al carrito.");
      return;
    }

    try {
      setIsSubmitting(true);
      await cartService.addItem({
        productId,
        size: selectedSize || "Única",
        quantity: 1,
        price: discountedPrice,
      });

      setSuccess("¡Producto añadido al carrito con éxito!");
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo añadir el producto al carrito."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOutOfStock = stockQuantity <= 0;

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Size Selection */}
      {needsSizeSelection && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-slate-200">Selecciona tu talla</span>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size.name;
              return (
                <button
                  key={size.name}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size.name);
                    setError(null);
                  }}
                  className={`
                    px-4
                    py-2
                    text-xs
                    font-bold
                    rounded-lg
                    border
                    transition-all
                    duration-200
                    active:scale-95
                    ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
                    }
                  `}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Alerts */}
      {error && <Alert message={error} type="error" />}
      {success && <Alert message={success} type="success" />}

      {/* CTA Button */}
      <div className="pt-2">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isSubmitting}
          isLoading={isSubmitting}
          className="w-full md:w-auto px-8 py-3"
        >
          {isOutOfStock ? "Agotado" : "Añadir al Carrito"}
        </Button>
      </div>
    </div>
  );
}
