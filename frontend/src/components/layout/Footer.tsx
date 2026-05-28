import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="
        mt-auto
        bg-[var(--primary)]
        text-white
        py-10
        px-6
        border-t
        border-[var(--border)]
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
        "
      >
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-wide">
            ShopWave
          </h2>

          <p className="text-[#D6EEF2]">
            Tu tienda online moderna.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">
            Navegación
          </h3>

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
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">
            Contacto
          </h3>

          <p className="text-[#D6EEF2]">
            contacto@shopwave.com
          </p>

          <p className="text-[#D6EEF2]">
            Cochabamba, Bolivia
          </p>
        </div>
      </div>
    </footer>
  )
}