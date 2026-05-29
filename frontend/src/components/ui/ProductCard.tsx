import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  discountedPrice?: number;
  discountPersent?: number;
  description?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  discountedPrice,
  discountPersent = 0,
  description,
}: ProductCardProps) {
  const hasDiscount = discountPersent > 0 && discountedPrice !== undefined;
  const displayPrice = hasDiscount ? discountedPrice : price;

  return (
    <article
      className="
        group
        flex
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-surface/60
        shadow-[0_4px_12px_var(--shadow-color)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-2xl
        hover:shadow-primary/5
        backdrop-blur-sm
      "
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-surface-alt">
        {image ? (
          <img
            src={image}
            alt={title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground-muted">
            Sin imagen
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-extrabold text-rose-accent backdrop-blur-md">
              -{discountPersent}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h2
          className="
            font-bold
            text-foreground-bright
            text-lg
            line-clamp-1
            transition-colors
            group-hover:text-primary
          "
        >
          {title}
        </h2>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground-muted leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-xl font-black text-primary">
            ${displayPrice.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-foreground-muted/80 line-through">
              ${price.toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={`/products/${id}`}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-primary
              px-4
              py-2.5
              text-sm
              font-bold
              text-btn-primary-text
              transition-all
              duration-200
              hover:opacity-90
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-md
              hover:shadow-primary/10
            "
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}