import PageLayout from "@/components/layout/PageLayout";
import { productService } from "@/services/product.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  let product;

  try {
    product = await productService.getProductById(productId);
  } catch (error) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
            {product.brand}
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">{product.title}</h1>

          <div className="mt-6 flex items-center gap-3">
            <p className="text-3xl font-bold text-slate-950">
              ${product.discountedPrice.toFixed(2)}
            </p>
            {product.discountPersent > 0 && (
              <>
                <p className="text-lg text-slate-400 line-through">
                  ${product.price.toFixed(2)}
                </p>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
                  -{product.discountPersent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-7 text-slate-600">{product.description}</p>

          <div className="mt-8 grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-950">Color:</span> {product.color}
            </p>
            <p>
              <span className="font-semibold text-slate-950">Stock disponible:</span> {product.quantity}
            </p>
          </div>

          <button className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-500 md:w-fit">
            Añadir al Carrito
          </button>
        </div>
      </div>
    </PageLayout>
  );
}