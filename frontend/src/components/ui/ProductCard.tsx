import Image from "next/image"
import Button from "./Button"
import Badge from "./Badge"

interface ProductCardProps {
  id: number
  title: string
  price: number
  image: string
}

export default function ProductCard({
  id,
  title,
  price,
  image
}: ProductCardProps) {
  return (
    <div
      className="
        border
        border-[var(--border)]
        rounded-2xl
        overflow-hidden
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        bg-[var(--surface)]
      "
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">

        <Badge>
          Nuevo
        </Badge>

        <h2
          className="
            font-semibold
            text-lg
            line-clamp-2
            text-[var(--foreground)]
          "
        >
          {title}
        </h2>

        <p
          className="
            text-2xl
            font-bold
            text-[var(--primary)]
          "
        >
          ${price}
        </p>

        <Button>
          Ver producto
        </Button>

      </div>
    </div>
  )
}