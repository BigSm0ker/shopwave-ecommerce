"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";
import { productService } from "@/services/product.service";
import ProductCard from "@/components/ui/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from "lucide-react";
import type { Product } from "@/models/product.model";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("none");
  const [stockOnly, setStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await productService.getProducts();
        setProducts(data);
        
        // Ajustar el precio máximo inicial según el producto más caro
        if (data.length > 0) {
          const prices = data.map((p) => {
            return p.discountedPrice !== undefined && p.discountPersent > 0 
              ? p.discountedPrice 
              : p.price;
          });
          const highestPrice = Math.max(...prices);
          const ceilPrice = Math.ceil(highestPrice);
          setAbsoluteMaxPrice(ceilPrice);
          setMaxPrice(ceilPrice);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setErrorMsg("No se pudieron cargar los productos desde la base de datos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Extraer categorías únicas dinámicamente de los productos cargados
  const categories = useMemo(() => {
    const names = products.map((p) => p.category?.name).filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(names))];
  }, [products]);

  // Filtrado y ordenación combinados
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro por texto (Búsqueda por título, descripción y marca)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }

    // Filtro por Categoría
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.name === selectedCategory);
    }

    // Filtro por Rango de Precio
    result = result.filter((p) => {
      const price = p.discountedPrice !== undefined && p.discountPersent > 0 ? p.discountedPrice : p.price;
      return price >= minPrice && price <= maxPrice;
    });

    // Filtro por Stock
    if (stockOnly) {
      result = result.filter((p) => p.quantity > 0);
    }

    // Ordenamiento
    if (sortBy === "price_asc") {
      result.sort((a, b) => {
        const priceA = a.discountedPrice !== undefined && a.discountPersent > 0 ? a.discountedPrice : a.price;
        const priceB = b.discountedPrice !== undefined && b.discountPersent > 0 ? b.discountedPrice : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => {
        const priceA = a.discountedPrice !== undefined && a.discountPersent > 0 ? a.discountedPrice : a.price;
        const priceB = b.discountedPrice !== undefined && b.discountPersent > 0 ? b.discountedPrice : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, stockOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("none");
    setStockOnly(false);
    setMinPrice(0);
    setMaxPrice(absoluteMaxPrice);
  };

  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedCategory !== "all" || 
    sortBy !== "none" || 
    stockOnly || 
    minPrice !== 0 || 
    maxPrice !== absoluteMaxPrice;

  return (
    <PageLayout>
      {/* Encabezado */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Explora la tienda
          </p>
          <h1 className="text-3xl font-black text-white mt-1">Catálogo de productos</h1>
        </div>
        <p className="max-w-md text-sm text-slate-400">
          Usa los filtros interactivos para encontrar exactamente lo que buscas en nuestro inventario.
        </p>
      </div>

      {errorMsg ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-rose-300 backdrop-blur-sm shadow-xl">
          <p className="font-semibold">{errorMsg}</p>
          <p className="text-xs text-rose-400/80 mt-1">Por favor verifica que el backend Spring Boot esté en ejecución.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* BARRA LATERAL DE FILTROS: Escritorio */}
          <aside className="hidden lg:block h-fit rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-cyan-400" />
                Filtros
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={10} />
                  Limpiar
                </button>
              )}
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Camiseta, gorra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300/30 transition-all placeholder:text-slate-500"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
              </div>
            </div>

            {/* Categorías */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Categoría</label>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    {cat === "all" ? "Todos los productos" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de Precios */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Precio máximo</label>
                <span className="text-xs font-bold text-cyan-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={absoluteMaxPrice || 1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>${minPrice}</span>
                <span>${absoluteMaxPrice}</span>
              </div>
            </div>

            {/* Filtro de Disponibilidad */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-cyan-400"
                />
                Solo en stock / disponible
              </label>
            </div>
          </aside>

          {/* PARTE PRINCIPAL: Productos y Buscador Móvil */}
          <section className="space-y-6">
            {/* Controles de Búsqueda y Ordenamiento superior */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/30 rounded-2xl border border-white/5 p-4">
              {/* Buscador visible en móviles y tablets */}
              <div className="w-full sm:max-w-xs relative lg:hidden">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-300 transition-all"
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-500" />
              </div>

              {/* Botón de Filtros Móviles */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition active:scale-[0.98]"
              >
                <SlidersHorizontal size={14} className="text-cyan-400" />
                Filtros
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                )}
              </button>

              <div className="text-xs text-slate-400 w-full text-center sm:text-left sm:w-auto">
                Mostrando <span className="font-bold text-white">{filteredProducts.length}</span> de{" "}
                <span className="font-bold text-slate-300">{products.length}</span> productos
              </div>

              {/* Ordenamiento */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <ArrowUpDown size={12} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-300 transition"
                >
                  <option value="none">Ordenar por: Defecto</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                  <option value="title_asc">Nombre: A - Z</option>
                </select>
              </div>
            </div>

            {/* Grid de Productos */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/40 p-5 space-y-4 shadow"
                  >
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2 justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center shadow-xl backdrop-blur-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-xl">
                  🔍
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">No se encontraron productos</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400 leading-relaxed">
                  No hay productos que coincidan con los filtros aplicados. Intenta restablecer los filtros.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-5 inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 active:scale-95"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    discountedPrice={product.discountedPrice}
                    discountPersent={product.discountPersent}
                    image={product.imageUrl}
                    description={product.description}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* FILTROS MÓVILES (OVERLAY & SIDE PANEL) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>

          {/* Panel Lateral */}
          <div className="relative w-full max-w-[300px] h-full bg-slate-950 border-l border-white/10 p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-cyan-400" />
                Filtros
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Camiseta, gorra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-cyan-300 transition-all placeholder:text-slate-600"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
              </div>
            </div>

            {/* Categorías */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Categorías</label>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileFiltersOpen(false);
                    }}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    {cat === "all" ? "Todos los productos" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de Precios */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Precio máximo</label>
                <span className="text-xs font-bold text-cyan-400">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={minPrice}
                max={absoluteMaxPrice || 1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>${minPrice}</span>
                <span>${absoluteMaxPrice}</span>
              </div>
            </div>

            {/* Filtro de Disponibilidad */}
            <div className="pt-2 border-t border-white/5">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="rounded border-white/10 bg-white/5 text-cyan-500 h-4 w-4 accent-cyan-400"
                />
                Solo en stock
              </label>
            </div>

            {/* Limpiar Filtros */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
                className="mt-auto w-full py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}