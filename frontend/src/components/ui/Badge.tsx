interface BadgeProps {
  children: React.ReactNode
}

export default function Badge({
  children
}: BadgeProps) {
  return (
    <span
      className="
        inline-block
        px-3
        py-1
        text-sm
        font-medium
        rounded-full
        bg-[var(--secondary)]
        text-white
        shadow-sm
      "
    >
      {children}
    </span>
  )
}