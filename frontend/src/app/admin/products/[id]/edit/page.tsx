"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Panel admin
            </p>
            <h1 className="text-3xl font-black text-white mt-1">Editar producto</h1>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition hover:bg-white/10"
          >
            Volver al panel
          </Link>
        </div>

        {isLoading ? (
          <p className="text-slate-300">Cargando producto...</p>
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl lg:grid-cols-2 backdrop-blur-sm">
            <section className="grid gap-4">
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Datos principales</h2>
              
              <Input
                label="Título"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />

              <Input
                as="textarea"
                label="Descripción"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
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
                  required
                />
                <Input
                  label="Color"
                  value={form.color}
                  onChange={(e) => updateField("color", e.target.value)}
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
              <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Tallas</h2>
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 mt-2">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-white">Editar tallas</h3>
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
                  Guardar cambios
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
        )}
      </PageLayout>
    </AdminGuard>
  );
}