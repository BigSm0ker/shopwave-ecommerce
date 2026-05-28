interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({
  title,
  description
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-20
        text-center
      "
    >
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      {
        description && (
          <p className="text-gray-500 mt-2">
            {description}
          </p>
        )
      }
    </div>
  )
}