"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import PageLayout from "@/components/layout/PageLayout";
import { AdminGuard } from "@/guards/AdminGuard";
import { productService } from "@/services/product.service";
import type { CreateProductRequest, Size } from "@/models/product.model";

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
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
};

type SizeRow = {
  name: string;
  quantity: string;
};

const initialForm: ProductFormState = {
  title: "",
  description: "",
  price: "",
  discountedPrice: "",
  discountPersent: "0",
  quantity: "",
  brand: "",
  color: "",
  imageUrl: "",
  topLevelCategory: "",
  secondLevelCategory: "",
  thirdLevelCategory: "",
};

const initialSizes: SizeRow[] = [{ name: "M", quantity: "1" }];

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

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [sizes, setSizes] = useState<SizeRow[]>(initialSizes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const addSizeRow = () => {
    setSizes((current) => [...current, { name: "", quantity: "1" }]);
  };

  const removeSizeRow = (index: number) => {
    setSizes((current) => current.filter((_, sizeIndex) => sizeIndex !== index));
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return "El título es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.brand.trim()) return "La marca es obligatoria.";
    if (!form.color.trim()) return "El color es obligatorio.";
    if (!form.imageUrl.trim()) return "La imagen es obligatoria.";
    if (!form.topLevelCategory.trim()) return "La categoría principal es obligatoria.";
    if (!form.secondLevelCategory.trim()) return "La subcategoría es obligatoria.";
    if (!form.thirdLevelCategory.trim()) return "La tercera categoría es obligatoria.";

    const price = Number(form.price);
    const discountedPrice = Number(form.discountedPrice);
    const discountPersent = Number(form.discountPersent);
    const quantity = Number(form.quantity);

    if (Number.isNaN(price) || price <= 0) return "El precio debe ser mayor a 0.";
    if (Number.isNaN(discountedPrice) || discountedPrice < 0) return "El precio con descuento no es válido.";
    if (Number.isNaN(discountPersent) || discountPersent < 0 || discountPersent > 100) {
      return "El porcentaje de descuento debe estar entre 0 y 100.";
    }
    if (Number.isNaN(quantity) || quantity < 0) return "La cantidad debe ser mayor o igual a 0.";

    const validSizes = sizes.filter((size) => size.name.trim() && !Number.isNaN(Number(size.quantity)));
    if (validSizes.length === 0) return "Agrega al menos una talla válida.";

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: CreateProductRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountedPrice: Number(form.discountedPrice),
      discountPersent: Number(form.discountPersent),
      quantity: Number(form.quantity),
      brand: form.brand.trim(),
      color: form.color.trim(),
      size: sizes
        .filter((size) => size.name.trim())
        .map((size): Size => ({
          name: size.name.trim(),
          quantity: Number(size.quantity),
        })),
      imageUrl: form.imageUrl.trim(),
      topLevelCategory: form.topLevelCategory.trim(),
      secondLevelCategory: form.secondLevelCategory.trim(),
      thirdLevelCategory: form.thirdLevelCategory.trim(),
    };

    try {
      setIsSubmitting(true);
      await productService.createProduct(payload);
      setSuccess("Producto creado correctamente.");
      setForm(initialForm);
      setSizes(initialSizes);

      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo crear el producto."
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
            <h1 className="text-3xl font-black text-slate-950">Crear producto</h1>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex w-fit rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Volver al panel
          </Link>
        </div>

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
            <h2 className="text-lg font-bold text-slate-950">Categorías y tallas</h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Categoría principal
                <input value={form.topLevelCategory} onChange={(event) => updateField("topLevelCategory", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Subcategoría
                <input value={form.secondLevelCategory} onChange={(event) => updateField("secondLevelCategory", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Tercera categoría
                <input value={form.thirdLevelCategory} onChange={(event) => updateField("thirdLevelCategory", event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
              </label>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-slate-950">Tallas</h3>
                <Button type="button" onClick={addSizeRow}>Agregar talla</Button>
              </div>

              {sizes.map((size, index) => (
                <div key={`${size.name}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Nombre
                    <input value={size.name} onChange={(event) => updateSize(index, "name", event.target.value)} placeholder="M" className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500" />
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
                {isSubmitting ? "Creando..." : "Guardar producto"}
              </Button>
              <Link href="/admin/products" className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Cancelar
              </Link>
            </div>
          </section>
        </form>
      </PageLayout>
    </AdminGuard>
  );
}
