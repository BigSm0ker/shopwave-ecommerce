import Skeleton from "./Skeleton"

export default function ProductCardSkeleton() {
  return (
    <div
      className="
        border
        rounded-xl
        overflow-hidden
        p-4
        flex
        flex-col
        gap-4
      "
    >
      <Skeleton className="h-64 w-full" />

      <Skeleton className="h-4 w-20" />

      <Skeleton className="h-6 w-full" />

      <Skeleton className="h-6 w-2/3" />

      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}