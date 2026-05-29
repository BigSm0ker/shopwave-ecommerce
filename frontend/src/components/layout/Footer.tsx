import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        mt-auto
        bg-surface-alt
        text-foreground-muted
        py-16
        px-6
        border-t
        border-border
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-3
          gap-12
        "
      >
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black tracking-wider text-foreground hover:text-primary transition-colors duration-200 w-fit">
            ShopWave
          </h2>
          <p className="text-sm text-foreground-muted leading-relaxed max-w-xs">
            Prendas básicas y accesorios atemporales de corte unisex, confeccionados con materiales conscientes hechos para perdurar.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest text-[11px]">
            Navegación
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-200">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary transition-colors duration-200">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-primary transition-colors duration-200">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact/Credits Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest text-[11px]">
            Contacto
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-foreground-muted font-medium">
            <li>
              <a href="mailto:contacto@shopwave.com" className="hover:text-primary transition-colors duration-200">
                contacto@shopwave.com
              </a>
            </li>
            <li>Cochabamba, Bolivia</li>
            <li className="pt-4 text-xs text-foreground-muted/60 border-t border-border-muted font-mono">
              &copy; {new Date().getFullYear()} ShopWave. Diseños sin etiquetas.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}