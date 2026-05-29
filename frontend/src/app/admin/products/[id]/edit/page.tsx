"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageLayout from "@/components/layout/PageLayout";
import { AdminGuard } from "@/guards/AdminGuard";
import type { Product, Size } from "@/models/product.model";
import { productService } from "@/services/product.service";

type ProductFormState = {
  title: string;
  description: string;
  price: string;
  discountedPrice: string;
  discountPersent: string;
  quantity: string;
  brand: string;
  color: string;
  imageUrl: string;
};

type SizeRow = {
  name: string;
  quantity: string;
};

const emptyForm: ProductFormState = {
  title: "",
  description: "",
  price: "",
  discountedPrice: "",
  discountPersent: "0",
  quantity: "",
  brand: "",
  color: "",
  imageUrl: "",
};

const toFormState = (product: Product): ProductFormState => ({
  title: product.title ?? "",
  description: product.description ?? "",
  price: String(product.price ?? ""),
  discountedPrice: String(product.discountedPrice ?? ""),
  discountPersent: String(product.discountPersent ?? 0),
  quantity: String(product.quantity ?? ""),
  brand: product.brand ?? "",
  color: product.color ?? "",
  imageUrl: product.imageUrl ?? "",
});

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("No se pudo leer la imagen."));
    };

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [sizes, setSizes] = useState<SizeRow[]>([{ name: "", quantity: "1" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const product = await productService.getProductById(productId);
        setForm(toFormState(product));
        setSizes(
          product.sizes?.length
            ? product.sizes.map((size) => ({
                name: size.name,
                quantity: String(size.quantity),
              }))
            : [{ name: "", quantity: "1" }]
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No se pudo cargar el producto."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const updateField = (field: keyof ProductFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateField("imageUrl", dataUrl);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "No se pudo leer la imagen.");
    }
  };

  const updateSize = (index: number, field: keyof SizeRow, value: string) => {
    setSizes((current) =>
      current.map((size, sizeIndex) =>
        sizeIndex === index ? { ...size, [field]: value } : size
      )
    );
  };

  const addSizeRow = () => setSizes((current) => [...current, { name: "", quantity: "1" }]);

  const removeSizeRow = (index: number) => {
    setSizes((current) => current.filter((_, sizeIndex) => sizeIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setIsSubmitting(true);
      const payload: Partial<Product> = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        discountedPrice: Number(form.discountedPrice),
        discountPersent: Number(form.discountPersent),
        quantity: Number(form.quantity),
        brand: form.brand.trim(),
        color: form.color.trim(),
        imageUrl: form.imageUrl.trim(),
        sizes: sizes
          .filter((size) => size.name.trim())
          .map((size): Size => ({
            name: size.name.trim(),
            quantity: Number(size.quantity),
          })),
      };

      await productService.updateProduct(productId, payload);
      setSuccess("Producto actualizado correctamente.");
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar el producto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <PageLayout>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
              Panel admin
            </p>
            <h1 className="text-3xl font-black text-slate-950">Editar producto</h1>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex w-fit rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Volver al panel
          </Link>
        </div>

        {isLoading ? (
          <p className="text-slate-600">Cargando producto...</p>
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2">
            <section className="grid gap-4">
              <h2 className="text-lg font-bold text-slate-950">Datos principales</h2>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Título
                <input value={form.title} onChange={(event) => updateField("title", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descripción
                <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={5} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Precio
                  <input type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Precio con descuento
                  <input type="number" min="0" value={form.discountedPrice} onChange={(event) => updateField("discountedPrice", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Descuento %
                  <input type="number" min="0" max="100" value={form.discountPersent} onChange={(event) => updateField("discountPersent", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Cantidad total
                  <input type="number" min="0" value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Marca
                  <input value={form.brand} onChange={(event) => updateField("brand", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Color
                  <input value={form.color} onChange={(event) => updateField("color", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                </label>
              </div>
              <div className="grid gap-2 text-sm font-medium text-slate-700">
                Imagen del producto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-600"
                />
                <input
                  value={form.imageUrl}
                  onChange={(event) => updateField("imageUrl", event.target.value)}
                  placeholder="https://... o selecciona un archivo"
                  className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Vista previa"
                    className="mt-2 h-40 w-full rounded-2xl object-cover"
                  />
                )}
              </div>
            </section>

            <section className="grid gap-4">
              <h2 className="text-lg font-bold text-slate-950">Tallas</h2>
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-950">Editar tallas</h3>
                  <Button type="button" onClick={addSizeRow}>Agregar talla</Button>
                </div>

                {sizes.map((size, index) => (
                  <div key={`${size.name}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Nombre
                      <input value={size.name} onChange={(event) => updateSize(index, "name", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Cantidad
                      <input type="number" min="0" value={size.quantity} onChange={(event) => updateSize(index, "quantity", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSizeRow(index)}
                      className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              {error && <Alert message={error} type="error" />}
              {success && <Alert message={success} type="success" />}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Actualizando..." : "Guardar cambios"}
                </Button>
                <Link href="/admin/products" className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Cancelar
                </Link>
              </div>
            </section>
          </form>
        )}
      </PageLayout>
    </AdminGuard>
  );
}