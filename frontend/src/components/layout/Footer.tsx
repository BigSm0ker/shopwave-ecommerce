import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        mt-auto
        bg-slate-950
        text-slate-400
        py-16
        px-6
        border-t
        border-white/10
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
          <h2 className="text-2xl font-black tracking-wider text-white hover:text-cyan-400 transition-colors duration-200 w-fit">
            ShopWave
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Prendas básicas y accesorios atemporales de corte unisex, confeccionados con materiales conscientes hechos para perdurar.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest text-[11px] text-slate-300">
            Navegación
          </h3>
          <ul className="flex flex-col gap-3 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-cyan-400 transition-colors duration-200">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition-colors duration-200">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-cyan-400 transition-colors duration-200">
                Carrito
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact/Credits Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest text-[11px] text-slate-300">
            Contacto
          </h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400 font-medium">
            <li>
              <a href="mailto:contacto@shopwave.com" className="hover:text-cyan-400 transition-colors duration-200">
                contacto@shopwave.com
              </a>
            </li>
            <li>Cochabamba, Bolivia</li>
            <li className="pt-4 text-xs text-slate-500 border-t border-white/5 font-mono">
              &copy; {new Date().getFullYear()} ShopWave. Diseños sin etiquetas.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}