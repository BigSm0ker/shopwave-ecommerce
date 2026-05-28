"use client"

import Link from "next/link"
import { Menu, ShoppingCart, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className="
        w-full
        border-b
        border-[var(--border)]
        bg-[var(--primary)]
        text-white
        shadow-sm
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
        "
      >

        {/* Logo */}
        <Link
          href="/"
          className="
            text-2xl
            font-bold
            tracking-wide
            hover:text-[var(--background)]
            transition
          "
        >
          ShopWave
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            href="/"
            className="
              hover:text-[var(--background)]
              transition
            "
          >
            Inicio
          </Link>

          <Link
            href="/products"
            className="
              hover:text-[var(--background)]
              transition
            "
          >
            Productos
          </Link>

          <Link
            href="/cart"
            className="
              hover:text-[var(--background)]
              transition
            "
          >
            Carrito
          </Link>

          <Link
            href="/login"
            className="
              hover:text-[var(--background)]
              transition
            "
          >
            Login
          </Link>

          <ShoppingCart
            size={22}
            className="
              cursor-pointer
              hover:text-[var(--background)]
              transition
            "
          />
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {
            isOpen
              ? <X size={28} />
              : <Menu size={28} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {
        isOpen && (
          <div
            className="
              md:hidden
              flex
              flex-col
              gap-4
              px-6
              pb-4
              bg-[var(--primary)]
            "
          >
            <Link
              href="/"
              className="
                hover:text-[var(--background)]
                transition
              "
            >
              Inicio
            </Link>

            <Link
              href="/products"
              className="
                hover:text-[var(--background)]
                transition
              "
            >
              Productos
            </Link>

            <Link
              href="/cart"
              className="
                hover:text-[var(--background)]
                transition
              "
            >
              Carrito
            </Link>

            <Link
              href="/login"
              className="
                hover:text-[var(--background)]
                transition
              "
            >
              Login
            </Link>
          </div>
        )
      }
    </nav>
  )
}