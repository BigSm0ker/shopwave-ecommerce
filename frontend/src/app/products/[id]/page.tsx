import PageLayout from "@/components/layout/PageLayout";
import { productService } from "@/services/product.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

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
      {/* Back link */}
      <div className="mb-6">
        <Link 
          href="/products" 
          className="text-sm font-semibold text-foreground-muted hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          &larr; Volver al catálogo
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface/60 shadow-[0_8px_30px_var(--shadow-color)] max-h-[500px] flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover max-h-[500px]"
            />
          ) : (
            <div className="py-24 text-foreground-muted text-sm">Sin imagen disponible</div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center rounded-3xl border border-border bg-surface/60 p-8 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-black text-foreground-bright leading-tight">{product.title}</h1>

          {/* Pricing */}
          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-3xl font-black text-primary">
              ${product.discountedPrice.toFixed(2)}
            </p>
            {product.discountPersent > 0 && (
              <>
                <p className="text-lg text-foreground-muted/80 line-through font-medium">
                  ${product.price.toFixed(2)}
                </p>
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-extrabold text-rose-accent">
                  -{product.discountPersent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-foreground-muted text-sm md:text-base">{product.description}</p>

          {/* Specs */}
          <div className="mt-8 grid gap-4 border-t border-border pt-6 text-sm text-foreground-muted sm:grid-cols-2">
            <div>
              <span className="font-semibold text-foreground-bright">Color:</span> {product.color}
            </div>
            <div>
              <span className="font-semibold text-foreground-bright">Stock disponible:</span> {product.quantity} unidades
            </div>
          </div>

          {/* Add to Cart button */}
          <div className="pt-6">
            <Button className="w-full md:w-auto px-8 py-3">
              Añadir al Carrito
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}