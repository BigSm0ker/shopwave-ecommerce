"use client"

import { useState } from "react"

import ProductCard from "@/components/ui/ProductCard"
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton"
import Spinner from "@/components/ui/Spinner"
import EmptyState from "@/components/ui/EmptyState"
import Modal from "@/components/ui/Modal"
import Alert from "@/components/ui/Alert"
import Button from "@/components/ui/Button"

import PageLayout from "@/components/layout/PageLayout"

export default function TestPage() {
  const [open, setOpen] = useState(false)

  return (
    <PageLayout>

      {/* Header */}
      <section className="mb-10">
        <h1
          className="
            text-4xl
            font-extrabold
            text-cyan-400
          "
        >
          ShopWave UI System
        </h1>

        <p className="mt-2 text-slate-300">
          Componentes reutilizables del ecommerce.
        </p>
      </section>

      {/* Product cards */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Product Cards
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          <ProductCard
            id={1}
            title="Laptop Gamer RGB"
            price={1299}
            image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
          />

          <ProductCard
            id={2}
            title="Auriculares Premium"
            price={199}
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
          />

          <ProductCard
            id={3}
            title="Smartphone Pro Max"
            price={899}
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
          />
        </div>
      </section>

      {/* Skeletons */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Skeleton Loading
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Alerts
        </h2>

        <div className="flex flex-col gap-4 max-w-md">
          <Alert
            message="Inicio de sesión exitoso"
            type="success"
          />

          <Alert
            message="Correo o contraseña incorrectos"
            type="error"
          />
        </div>
      </section>

      {/* Spinner */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Loading Spinner
        </h2>

        <Spinner />
      </section>

      {/* Modal */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Modal
        </h2>

        <Button onClick={() => setOpen(true)}>
          Abrir modal
        </Button>

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Producto agregado"
        >
          <p className="text-slate-300">
            El producto se agregó correctamente al carrito.
          </p>
        </Modal>
      </section>

      {/* Empty state */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Empty State
        </h2>

        <div
          className="
            bg-slate-900/60
            rounded-3xl
            border
            border-white/10
            shadow-xl
            backdrop-blur-sm
          "
        >
          <EmptyState
            title="No hay productos"
            description="Intenta nuevamente más tarde."
          />
        </div>
      </section>

    </PageLayout>
  )
}