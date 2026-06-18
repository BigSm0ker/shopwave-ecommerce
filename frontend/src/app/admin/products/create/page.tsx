"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import PageLayout from "@/components/layout/PageLayout";
import { AdminGuard } from "@/guards/AdminGuard";
import { productService } from "@/services/product.service";
import type { CreateProductRequest, Size } from "@/models/product.model";
import type { FieldErrors, ProductField } from "@/utils/validation.util";
import {
  getErrorMessage,
  hasFormErrors,
  validateProductForm,
} from "@/utils/validation.util";

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ProductField>>({});

  const updateField = (field: keyof ProductFormState, value: string) => {
    setError(null);
    setSuccess(null);

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setForm((current) => {
      const updatedForm = { ...current, [field]: value };

      if (field === "price" || field === "discountPersent") {
        const priceNum = Number(updatedForm.price);
        const discountNum = Number(updatedForm.discountPersent);

        if (
          !Number.isNaN(priceNum) &&
          !Number.isNaN(discountNum) &&
          priceNum >= 0 &&
          discountNum >= 0
        ) {
          const calculatedPrice = priceNum - priceNum * (discountNum / 100);
          updatedForm.discountedPrice = calculatedPrice.toFixed(2);
        } else if (updatedForm.price === "") {
          updatedForm.discountedPrice = "";
        }
      }

      return updatedForm;
    });
  };

  const handleImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateField("imageUrl", dataUrl);
    } catch (fileError) {
      setError(
        getErrorMessage(fileError, "No se pudo leer la imagen seleccionada.")
      );
    }
  };

  const updateSize = (index: number, field: keyof SizeRow, value: string) => {
    setError(null);
    setSuccess(null);

    setFieldErrors((current) => ({
      ...current,
      sizes: undefined,
    }));

    setSizes((current) =>
      current.map((size, sizeIndex) =>
        sizeIndex === index ? { ...size, [field]: value } : size
      )
    );
  };

  const addSizeRow = () => {
    setFieldErrors((current) => ({
      ...current,
      sizes: undefined,
    }));

    setSizes((current) => [...current, { name: "", quantity: "1" }]);
  };

  const removeSizeRow = (index: number) => {
    setFieldErrors((current) => ({
      ...current,
      sizes: undefined,
    }));

    setSizes((current) =>
      current.filter((_, sizeIndex) => sizeIndex !== index)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const nextErrors = validateProductForm({
      ...form,
      sizes,
    });

    setFieldErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      setError("Corrige los campos marcados antes de guardar el producto.");
      return;
    }

    const validSizes = sizes
      .filter((size) => {
        const sizeQuantity = Number(size.quantity);

        return (
          size.name.trim() &&
          !Number.isNaN(sizeQuantity) &&
          sizeQuantity >= 0 &&
          Number.isInteger(sizeQuantity)
        );
      })
      .map((size): Size => ({
        name: size.name.trim(),
        quantity: Number(size.quantity),
      }));

    const payload: CreateProductRequest = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountedPrice: Number(form.discountedPrice),
      discountPersent: Number(form.discountPersent),
      quantity: Number(form.quantity),
      brand: form.brand.trim(),
      color: form.color.trim(),
      size: validSizes,
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
      setFieldErrors({});

      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (requestError) {
      setError(
        getErrorMessage(requestError, "No se pudo crear el producto.")
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

            <h1 className="mt-1 text-3xl font-black text-white">
              Crear producto
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Volver al panel
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-xl backdrop-blur-sm sm:p-6 lg:grid-cols-2"
        >
          <section className="grid gap-4">
            <h2 className="border-b border-white/5 pb-2 text-lg font-bold text-white">
              Datos principales
            </h2>

            <Input
              label="Título"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Ej. Zapatillas Running Premium"
              error={fieldErrors.title ?? null}
              required
            />

            <Input
              as="textarea"
              label="Descripción"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe los detalles del producto..."
              rows={4}
              error={fieldErrors.description ?? null}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Precio"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                error={fieldErrors.price ?? null}
                required
              />

              <Input
                label="Precio con descuento"
                type="number"
                min="0"
                step="0.01"
                value={form.discountedPrice}
                onChange={(event) =>
                  updateField("discountedPrice", event.target.value)
                }
                error={fieldErrors.discountedPrice ?? null}
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
                onChange={(event) =>
                  updateField("discountPersent", event.target.value)
                }
                error={fieldErrors.discountPersent ?? null}
              />

              <Input
                label="Cantidad total stock"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(event) =>
                  updateField("quantity", event.target.value)
                }
                error={fieldErrors.quantity ?? null}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Marca"
                value={form.brand}
                onChange={(event) => updateField("brand", event.target.value)}
                placeholder="Ej. Nike"
                error={fieldErrors.brand ?? null}
                required
              />

              <Input
                label="Color"
                value={form.color}
                onChange={(event) => updateField("color", event.target.value)}
                placeholder="Ej. Negro"
                error={fieldErrors.color ?? null}
                required
              />
            </div>

            <div className="grid gap-2 text-sm font-medium text-slate-200">
              <label className="block text-sm font-medium text-slate-200">
                Imagen del producto
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-slate-950 hover:file:bg-cyan-300"
              />

              <Input
                label=""
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                placeholder="https://... o selecciona un archivo"
                error={fieldErrors.imageUrl ?? null}
              />

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  className="mt-2 h-40 w-full rounded-2xl border border-white/10 object-cover shadow-lg"
                />
              )}
            </div>
          </section>

          <section className="grid gap-4">
            <h2 className="border-b border-white/5 pb-2 text-lg font-bold text-white">
              Categorías y tallas
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Categoría principal"
                value={form.topLevelCategory}
                onChange={(event) =>
                  updateField("topLevelCategory", event.target.value)
                }
                placeholder="Hombre"
                error={fieldErrors.topLevelCategory ?? null}
                required
              />

              <Input
                label="Subcategoría"
                value={form.secondLevelCategory}
                onChange={(event) =>
                  updateField("secondLevelCategory", event.target.value)
                }
                placeholder="Ropa"
                error={fieldErrors.secondLevelCategory ?? null}
                required
              />

              <Input
                label="Tercera categoría"
                value={form.thirdLevelCategory}
                onChange={(event) =>
                  updateField("thirdLevelCategory", event.target.value)
                }
                placeholder="Camisetas"
                error={fieldErrors.thirdLevelCategory ?? null}
                required
              />
            </div>

            <div className="mt-2 grid gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-white">Tallas</h3>

                <Button variant="secondary" onClick={addSizeRow}>
                  Agregar talla
                </Button>
              </div>

              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 sm:grid-cols-[1fr_120px_auto] sm:items-end"
                >
                  <Input
                    label="Nombre"
                    value={size.name}
                    onChange={(event) =>
                      updateSize(index, "name", event.target.value)
                    }
                    placeholder="M"
                  />

                  <Input
                    label="Cantidad"
                    type="number"
                    min="0"
                    value={size.quantity}
                    onChange={(event) =>
                      updateSize(index, "quantity", event.target.value)
                    }
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

              {fieldErrors.sizes && (
                <Alert message={fieldErrors.sizes} type="error" />
              )}
            </div>

            {error && <Alert message={error} type="error" />}
            {success && <Alert message={success} type="success" />}

            <div className="flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:flex-wrap">
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Guardar producto
              </Button>

              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
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