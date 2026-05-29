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

    return [
      "transition",
      isActive ? "text-[var(--background)]" : "hover:text-[var(--background)]",
    ].join(" ");
  };

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

          {isAuthenticated ? (
            <>
              <Link href="/profile" className={linkClass("/profile")}>
                {user ? user.firstName : "Perfil"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                <LogOut size={16} />
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              Login
            </Link>
          )}

          <ShoppingCart size={22} className="cursor-pointer transition hover:text-[var(--background)]" />
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {
        isOpen && (
          <div className="md:hidden flex flex-col gap-4 px-6 pb-4 bg-[var(--primary)]">
            <Link href="/" className={linkClass("/")}>Inicio</Link>
            <Link href="/products" className={linkClass("/products")}>Productos</Link>
            <Link href="/cart" className={linkClass("/cart")}>Carrito</Link>
            {user?.role === "ROLE_ADMIN" && (
              <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/profile" className={linkClass("/profile")}>
                  <span className="inline-flex items-center gap-2">
                    <UserCircle2 size={16} />
                    {user ? user.firstName : "Perfil"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className={linkClass("/login")}>Login</Link>
            )}
          </div>
        )
      }
    </nav>
  );
}