import Link from "next/link";
import { productService } from "@/services/product.service";
import ProductCard from "@/components/ui/ProductCard";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_45%)] text-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              Nueva Colección
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-none">
              Estilo sin etiquetas. Ropa y accesorios unisex.
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-300 leading-relaxed max-w-[65ch]">
              Explora nuestra colección curada de prendas esenciales y accesorios sin género. Diseños minimalistas de alta durabilidad hechos para adaptarse a ti.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-400/10"
              >
                Ver catálogo
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <aside className="w-full lg:max-w-md rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-cyan-400" />
              Nuestra Propuesta
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-slate-200">
              <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] text-cyan-300 font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Diseño Atemporal</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Siluetas cómodas diseñadas para adaptarse a cualquier cuerpo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] text-cyan-300 font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Materiales Sostenibles</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Algodón premium orgánico y fibras sintéticas recicladas.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20 text-[10px] text-cyan-300 font-bold">✓</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Empaque Eco-amigable</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Envíos express a nivel nacional con bolsas 100% compostables.</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Prendas Destacadas</h2>
            <p className="mt-2 text-slate-400 text-sm">
              Una selección cuidada de nuestros básicos más cotizados y accesorios esenciales.
            </p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1">
            Explorar catálogo completo <ArrowRight size={14} />
          </Link>
        </div>

        {errorMsg ? (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-rose-300 backdrop-blur-sm shadow-xl">
            <p className="font-semibold text-sm">{errorMsg}</p>
            <p className="text-xs text-rose-400/80 mt-1">Por favor verifica que la base de datos y la API de Spring Boot estén activas.</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-slate-400 backdrop-blur-sm shadow-xl">
            <p className="font-semibold text-white">Catálogo vacío</p>
            <p className="text-sm mt-1">No se encontraron productos disponibles en este momento.</p>
          </div>
        ) : (

          <div
  className="
    flex
    gap-6
    overflow-x-auto
    pb-4
    scroll-smooth
  "
>
  {featuredProducts.map((product) => (
    <div
      key={product.id}
      className="
        min-w-[280px]
        max-w-[280px]
        flex-shrink-0
      "
    >
      <ProductCard
        id={product.id}
        title={product.title}
        price={product.price}
        discountedPrice={product.discountedPrice}
        discountPersent={product.discountPersent}
        image={product.imageUrl}
        description={product.description}
      />
    </div>
  ))}
</div>
        )}
      </section>

      {/* Bento Grid Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-white/5">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white">Nuestra Filosofía</h2>
          <p className="mt-2 text-slate-400 text-sm">Cómo confeccionamos y entregamos cada una de nuestras piezas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cell 1: Materials (Width 2 on medium+) */}
          <div className="md:col-span-2 rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-cyan-950/20 via-slate-900/40 to-slate-950 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-all duration-500"></div>
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-cyan-400/10 p-3 text-cyan-300 border border-cyan-400/20">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mt-6">Producción Consciente</h3>
              <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
                Trabajamos únicamente con proveedores éticos que emplean procesos de teñido con bajo consumo de agua y fibras regeneradas. Nuestro algodón orgánico está certificado y libre de pesticidas dañinos, logrando prendas amables con tu piel y con el entorno.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex gap-4 text-xs font-mono text-cyan-400">
              <span>ALGODÓN: 100% ORGÁNICO</span>
              <span>CERTIFICACIÓN: CERTIFIED LABELS</span>
            </div>
          </div>

          {/* Cell 2: Delivery */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 flex flex-col justify-between shadow-lg backdrop-blur-sm relative group">
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-white/5 p-3 text-white border border-white/10">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mt-6">Envío Express</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Despachamos tu pedido en menos de 24 horas hábiles. Ofrecemos seguimiento detallado en tiempo real en cada etapa del transporte.
              </p>
            </div>
            <div className="mt-8 rounded-xl bg-slate-950 p-4 border border-white/5 font-mono text-[11px] text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Pedido despachado · En ruta</span>
            </div>
          </div>

          {/* Cell 3: Support */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 flex flex-col justify-between shadow-lg backdrop-blur-sm relative group">
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-white/5 p-3 text-white border border-white/10">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mt-6">Garantía de Satisfacción</h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                ¿La talla no fue la adecuada? Realiza tu cambio de manera rápida y sin costes adicionales en un plazo de 30 días.
              </p>
            </div>
            <div className="mt-8 text-xs font-mono text-cyan-400 tracking-wider">
              <span>CAMBIOS: HASTA 30 DÍAS</span>
            </div>
          </div>

          {/* Cell 4: Design (Width 2 on medium+) */}
          <div className="md:col-span-2 rounded-3xl border border-indigo-500/10 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-slate-950 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl group-hover:bg-indigo-400/10 transition-all duration-500"></div>
            <div>
              <div className="inline-flex items-center justify-center rounded-xl bg-indigo-400/10 p-3 text-indigo-300 border border-indigo-400/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mt-6">Patrones de Silueta Fluida</h3>
              <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
                Nuestras prendas están diseñadas en base a moldes inclusivos. Estudiamos las proporciones corporales para crear caídas naturales y holguras que lucen impecables sin importar la tipología corporal de quien las vista.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex gap-4 text-xs font-mono text-indigo-400">
              <span>CAÍDA: COMFORT FIT</span>
              <span>PATRONAJE: SIN GÉNERO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Wall */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-white/5 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
          <span className="font-mono text-xs tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors cursor-default">SOSTENIBLE</span>
          <span className="font-mono text-xs tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors cursor-default">ATEMPORAL</span>
          <span className="font-mono text-xs tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors cursor-default">SIN GÉNERO</span>
          <span className="font-mono text-xs tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors cursor-default">PREMIUM</span>
          <span className="font-mono text-xs tracking-[0.3em] text-slate-400 hover:text-cyan-400 transition-colors cursor-default">MINIMALISTA</span>
        </div>
      </section>
    </main>
  );
}
