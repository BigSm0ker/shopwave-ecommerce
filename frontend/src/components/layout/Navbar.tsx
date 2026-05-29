"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X, LogOut, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const linkClass = (href: string) => {
    const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

    return `
      text-sm
      font-medium
      transition-all
      duration-200
      hover:scale-[1.02]
      ${isActive ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-cyan-300"}
    `;
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-40
        w-full
        h-16
        border-b
        border-white/10
        bg-slate-950/75
        backdrop-blur-md
        text-white
        shadow-lg
        flex
        items-center
      "
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="
            text-xl
            font-black
            tracking-wider
            bg-gradient-to-r
            from-cyan-400
            to-teal-300
            bg-clip-text
            text-transparent
            hover:opacity-90
            transition-all
            duration-200
            hover:scale-[1.02]
          "
        >
          ShopWave
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass("/")}>
            Inicio
          </Link>
          <Link href="/products" className={linkClass("/products")}>
            Productos
          </Link>
          <Link href="/cart" className={linkClass("/cart")}>
            Carrito
          </Link>
          {user?.role === "ROLE_ADMIN" && (
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          )}

          <div className="h-4 w-[1px] bg-white/10"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className="text-sm font-semibold text-slate-200 hover:text-cyan-300 flex items-center gap-1.5 transition duration-200"
              >
                <UserCircle2 size={16} className="text-cyan-400" />
                {user ? user.firstName : "Perfil"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-rose-500/20
                  bg-rose-500/5
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-rose-300
                  transition-all
                  duration-200
                  hover:bg-rose-500/10
                  hover:border-rose-500/30
                  active:scale-[0.98]
                "
              >
                <LogOut size={12} />
                Salir
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-cyan-400
                px-4
                py-2
                text-xs
                font-bold
                text-slate-950
                transition-all
                duration-200
                hover:bg-cyan-300
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              Iniciar sesión
            </Link>
          )}

          <Link href="/cart" className="relative text-slate-300 hover:text-cyan-300 transition duration-200">
            <ShoppingCart size={18} />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden flex flex-col gap-4 px-6 pb-6 bg-slate-950/95 border-b border-white/10 pt-4 shadow-xl backdrop-blur-lg">
          <Link href="/" className={linkClass("/")}>Inicio</Link>
          <Link href="/products" className={linkClass("/products")}>Productos</Link>
          <Link href="/cart" className={linkClass("/cart")}>Carrito</Link>
          {user?.role === "ROLE_ADMIN" && (
            <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
          )}
          
          <div className="h-[1px] w-full bg-white/5 my-1"></div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <Link href="/profile" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <UserCircle2 size={18} className="text-cyan-400" />
                {user ? user.firstName : "Perfil"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-rose-500/20
                  bg-rose-500/5
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-rose-300
                  transition
                  hover:bg-rose-500/10
                "
              >
                <LogOut size={14} />
                Salir
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-cyan-400
                py-2.5
                text-sm
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-300
              "
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}