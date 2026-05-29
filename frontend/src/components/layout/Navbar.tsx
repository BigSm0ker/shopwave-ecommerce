"use client";

import Link from "next/link";
import { Menu, ShoppingCart, X, LogOut, UserCircle2, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
      ${isActive ? "text-primary font-semibold" : "text-foreground-muted hover:text-primary"}
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
        border-border
        bg-surface/75
        backdrop-blur-md
        text-foreground
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
            from-[var(--logo-from)]
            to-[var(--logo-to)]
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
        <div className="hidden md:flex items-center gap-6">
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

          <div className="h-4 w-[1px] bg-border"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className="text-sm font-semibold text-foreground-muted hover:text-primary flex items-center gap-1.5 transition duration-200"
              >
                <UserCircle2 size={16} className="text-primary" />
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
                  text-rose-accent
                  transition-all
                  duration-200
                  hover:bg-rose-500/10
                  hover:border-rose-500/30
                  active:scale-[0.98]
                  cursor-pointer
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
                bg-primary
                px-4
                py-2
                text-xs
                font-bold
                text-btn-primary-text
                transition-all
                duration-200
                hover:opacity-90
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              Iniciar sesión
            </Link>
          )}

          <div className="h-4 w-[1px] bg-border"></div>

          <Link href="/cart" className="relative text-foreground-muted hover:text-primary transition duration-200">
            <ShoppingCart size={18} />
          </Link>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="
              relative
              p-2
              rounded-xl
              border
              border-border
              bg-surface-alt/50
              text-foreground-muted
              hover:text-primary
              hover:border-primary/30
              transition-all
              duration-200
              active:scale-[0.95]
              cursor-pointer
            "
            aria-label="Cambiar tema"
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              {theme === "dark" ? (
                <Sun size={16} className="transition-transform duration-500 rotate-0 scale-100 text-[var(--yellow-accent)]" />
              ) : (
                <Moon size={16} className="transition-transform duration-500 rotate-360 scale-100 text-cyan-600" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-foreground-muted hover:text-foreground transition cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden flex flex-col gap-4 px-6 pb-6 bg-surface/95 border-b border-border pt-4 shadow-xl backdrop-blur-lg">
          <Link href="/" className={linkClass("/")}>Inicio</Link>
          <Link href="/products" className={linkClass("/products")}>Productos</Link>
          <Link href="/cart" className={linkClass("/cart")}>Carrito</Link>
          {user?.role === "ROLE_ADMIN" && (
            <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
          )}
          
          <div className="h-[1px] w-full bg-border my-1"></div>

          {/* Theme switcher for mobile */}
          <div className="flex items-center justify-between text-sm font-semibold text-foreground-muted py-1">
            <span>Tema: {theme === "dark" ? "Oscuro" : "Claro"}</span>
            <button
              onClick={toggleTheme}
              className="
                relative
                p-2
                rounded-xl
                border
                border-border
                bg-surface-alt/50
                text-foreground-muted
                hover:text-primary
                hover:border-primary/30
                transition-all
                duration-200
                active:scale-[0.95]
                cursor-pointer
              "
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-[var(--yellow-accent)]" />
              ) : (
                <Moon size={16} className="text-cyan-600" />
              )}
            </button>
          </div>

          <div className="h-[1px] w-full bg-border my-1"></div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <Link href="/profile" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <UserCircle2 size={18} className="text-primary" />
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
                  text-rose-accent
                  transition
                  hover:bg-rose-500/10
                  cursor-pointer
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
                bg-primary
                py-2.5
                text-sm
                font-bold
                text-btn-primary-text
                transition
                hover:opacity-90
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