import Link from "next/link";
import { productService } from "@/services/product.service";
import ProductCarousel from "@/components/products/ProductCarousel";
import { Leaf, Truck, Package, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import type { Product } from "@/models/product.model";

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredProducts: Product[] = [];
  let errorMsg = null;

  try {
    const products = await productService.getProducts();
    if (products && products.length > 0) {
      featuredProducts = products.slice(0, 10);
      }
  } catch (error) {
    console.error("Error fetching products on Home page:", error);
    errorMsg = "No se pudieron cargar los productos desde la base de datos.";
  }

  return (
    <main className="min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              Nueva Colección
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-none text-foreground-bright">
              Estilo sin etiquetas. Ropa y accesorios unisex.
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground-muted leading-relaxed max-w-[65ch]">
              Explora nuestra colección curada de prendas esenciales y accesorios sin género. Diseños minimalistas de alta durabilidad hechos para adaptarse a ti.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-btn-primary-text transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10"
              >
                Ver catálogo
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-alt/50 px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-surface-alt hover:border-border hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <aside className="w-full lg:max-w-md rounded-3xl border border-border bg-surface/40 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            <h2 className="text-lg font-bold text-foreground-bright flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Nuestra Propuesta
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-foreground-muted">
              <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface-alt/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-foreground-bright text-sm">Diseño Atemporal</h3>
                  <p className="text-xs text-foreground-muted/80 mt-0.5">Siluetas cómodas diseñadas para adaptarse a cualquier cuerpo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface-alt/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-foreground-bright text-sm">Materiales Sostenibles</h3>
                  <p className="text-xs text-foreground-muted/80 mt-0.5">Algodón premium orgánico y fibras sintéticas recicladas.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface-alt/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-foreground-bright text-sm">Empaque Eco-amigable</h3>
                  <p className="text-xs text-foreground-muted/80 mt-0.5">Envíos express a nivel nacional con bolsas 100% compostables.</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-border-muted">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-foreground-bright">Prendas Destacadas</h2>
            <p className="mt-2 text-foreground-muted text-sm">
              Una selección cuidada de nuestros básicos más cotizados y accesorios esenciales.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-primary hover:opacity-80 transition-colors inline-flex items-center gap-1">
            Explorar catálogo completo <ArrowRight size={14} />
          </Link>
        </div>

        {errorMsg ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-rose-accent backdrop-blur-sm shadow-xl">
            <p className="font-semibold text-sm">{errorMsg}</p>
            <p className="text-xs mt-1 opacity-80">Por favor verifica que la base de datos y la API de Spring Boot estén activas.</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/60 p-8 text-foreground-muted backdrop-blur-sm shadow-xl">
            <p className="font-semibold text-foreground-bright">Catálogo vacío</p>
            <p className="text-sm mt-1">No se encontraron productos disponibles en este momento.</p>
          </div>
        ) : (

          <ProductCarousel products={featuredProducts} />
        )}
      </section>

      {/* Bento Grid Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-border-muted">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-foreground-bright">Nuestra Filosofía</h2>
          <p className="mt-2 text-foreground-muted text-sm">Cómo confeccionamos y entregamos cada una de nuestras piezas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cell 1: Materials */}
          <div className="md:col-span-2 rounded-3xl border border-primary/10 bg-gradient-to-br from-[var(--bento-cyan-from)] via-[var(--bento-cyan-via)] to-[var(--bento-cyan-to)] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary border border-primary/20">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground-bright mt-6">Producción Consciente</h3>
              <p className="text-foreground-muted text-sm mt-2 max-w-xl leading-relaxed">
                Trabajamos únicamente con proveedores éticos que emplean procesos de teñido con bajo consumo de agua y fibras regeneradas. Nuestro algodón orgánico está certificado y libre de pesticidas dañinos, logrando prendas amables con tu piel y con el entorno.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border-muted flex gap-4 text-xs font-mono text-primary">
              <span>ALGODÓN: 100% ORGÁNICO</span>
              <span>CERTIFICACIÓN: CERTIFIED LABELS</span>
            </div>
          </div>

          {/* Cell 2: Delivery */}
          <div className="rounded-3xl border border-border bg-surface/60 p-6 flex flex-col justify-between shadow-lg backdrop-blur-sm relative group">
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-surface-alt text-foreground border border-border">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground-bright mt-6">Envío Express</h3>
              <p className="text-foreground-muted text-sm mt-2 leading-relaxed">
                Despachamos tu pedido en menos de 24 horas hábiles. Ofrecemos seguimiento detallado en tiempo real en cada etapa del transporte.
              </p>
            </div>
            <div className="mt-8 rounded-xl bg-surface-alt p-4 border border-border-muted font-mono text-[11px] text-foreground-muted flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-accent animate-pulse"></span>
              <span>Pedido despachado · En ruta</span>
            </div>
          </div>

          {/* Cell 3: Support */}
          <div className="rounded-3xl border border-border bg-surface/60 p-6 flex flex-col justify-between shadow-lg backdrop-blur-sm relative group">
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-surface-alt text-foreground border border-border">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground-bright mt-6">Garantía de Satisfacción</h3>
              <p className="text-foreground-muted text-sm mt-2 leading-relaxed">
                ¿La talla no fue la adecuada? Realiza tu cambio de manera rápida y sin costes adicionales en un plazo de 30 días.
              </p>
            </div>
            <div className="mt-8 text-xs font-mono text-primary tracking-wider">
              <span>CAMBIOS: HASTA 30 DÍAS</span>
            </div>
          </div>

          {/* Cell 4: Design */}
          <div className="md:col-span-2 rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-[var(--bento-indigo-from)] via-[var(--bento-indigo-via)] to-[var(--bento-indigo-to)] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-500"></div>
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-indigo-500/10 p-3 text-indigo-accent border border-indigo-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground-bright mt-6">Patrones de Silueta Fluida</h3>
              <p className="text-foreground-muted text-sm mt-2 max-w-xl leading-relaxed">
                Nuestras prendas están diseñadas en base a moldes inclusivos. Estudiamos las proporciones corporales para crear caídas naturales y holguras que lucen impecables sin importar la tipología corporal de quien las vista.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-border-muted flex gap-4 text-xs font-mono text-indigo-accent-alt">
              <span>CAÍDA: COMFORT FIT</span>
              <span>PATRONAJE: SIN GÉNERO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Wall */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-border-muted flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
          <span className="font-mono text-xs tracking-[0.3em] text-foreground-muted hover:text-primary transition-colors cursor-default">SOSTENIBLE</span>
          <span className="font-mono text-xs tracking-[0.3em] text-foreground-muted hover:text-primary transition-colors cursor-default">ATEMPORAL</span>
          <span className="font-mono text-xs tracking-[0.3em] text-foreground-muted hover:text-primary transition-colors cursor-default">SIN GÉNERO</span>
          <span className="font-mono text-xs tracking-[0.3em] text-foreground-muted hover:text-primary transition-colors cursor-default">PREMIUM</span>
          <span className="font-mono text-xs tracking-[0.3em] text-foreground-muted hover:text-primary transition-colors cursor-default">MINIMALISTA</span>
        </div>
      </section>
    </main>
  );
}
