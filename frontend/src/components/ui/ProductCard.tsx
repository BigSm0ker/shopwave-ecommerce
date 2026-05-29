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
        border-white/10
        bg-slate-900/60
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:shadow-2xl
        hover:shadow-cyan-400/5
        backdrop-blur-sm
      "
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
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
          <div className="flex h-full w-full items-center justify-center text-slate-600">
            Sin imagen
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10">
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-extrabold text-rose-300 backdrop-blur-md">
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
            text-white
            text-lg
            line-clamp-1
            transition-colors
            group-hover:text-cyan-300
          "
        >
          {title}
        </h2>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-xl font-black text-cyan-400">
            ${displayPrice.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-slate-500 line-through">
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
              bg-cyan-400
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-950
              transition-all
              duration-200
              hover:bg-cyan-300
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-md
              hover:shadow-cyan-400/10
            "
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}