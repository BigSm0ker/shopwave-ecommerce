"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Panel admin
            </p>
            <h1 className="text-3xl font-black text-white mt-1">Crear producto</h1>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition hover:bg-white/10"
          >
            Volver al panel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl lg:grid-cols-2 backdrop-blur-sm">
          <section className="grid gap-4">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Datos principales</h2>

            <Input
              label="Título"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ej. Zapatillas Running Premium"
              required
            />

            <Input
              as="textarea"
              label="Descripción"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describre los detalles del producto..."
              rows={4}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Precio"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
              <Input
                label="Precio con descuento"
                type="number"
                min="0"
                step="0.01"
                value={form.discountedPrice}
                onChange={(e) => updateField("discountedPrice", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Descuento %"
                type="number"
                min="0"
                max="100"
                value={form.discountPersent}
                onChange={(e) => updateField("discountPersent", e.target.value)}
              />
              <Input
                label="Cantidad total"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Marca"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="Ej. Nike"
                required
              />
              <Input
                label="Color"
                value={form.color}
                onChange={(e) => updateField("color", e.target.value)}
                placeholder="Ej. Negro"
                required
              />
            </div>

            <div className="grid gap-2 text-sm font-medium text-slate-200">
              <label className="block text-sm font-medium text-slate-200">Imagen del producto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-950 hover:file:bg-cyan-300 transition"
              />
              <Input
                label=""
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="https://... o selecciona un archivo"
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  className="mt-2 h-40 w-full rounded-2xl object-cover border border-white/10 shadow-lg"
                />
              )}
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Categorías y tallas</h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Categoría principal"
                value={form.topLevelCategory}
                onChange={(e) => updateField("topLevelCategory", e.target.value)}
                placeholder="Hombre"
                required
              />
              <Input
                label="Subcategoría"
                value={form.secondLevelCategory}
                onChange={(e) => updateField("secondLevelCategory", e.target.value)}
                placeholder="Ropa"
                required
              />
              <Input
                label="Tercera categoría"
                value={form.thirdLevelCategory}
                onChange={(e) => updateField("thirdLevelCategory", e.target.value)}
                placeholder="Camisetas"
                required
              />
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 mt-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-white">Tallas</h3>
                <Button variant="secondary" onClick={addSizeRow}>
                  Agregar talla
                </Button>
              </div>

              {sizes.map((size, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 sm:grid-cols-[1fr_120px_auto] sm:items-end">
                  <Input
                    label="Nombre"
                    value={size.name}
                    onChange={(e) => updateSize(index, "name", e.target.value)}
                    placeholder="M"
                  />
                  <Input
                    label="Cantidad"
                    type="number"
                    min="0"
                    value={size.quantity}
                    onChange={(e) => updateSize(index, "quantity", e.target.value)}
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeSizeRow(index)}
                    className="w-full sm:w-auto"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
            </div>

            {error && <Alert message={error} type="error" />}
            {success && <Alert message={success} type="success" />}

            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
              <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                Guardar producto
              </Button>
              <Link
                href="/admin/products"
                className="inline-flex items-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition hover:bg-white/10"
              >
                Cancelar
              </Link>
            </div>
          </section>
        </form>
      </PageLayout>
    </AdminGuard>
  );
}
