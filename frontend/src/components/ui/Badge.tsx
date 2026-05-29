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
        px-2.5
        py-1
        text-xs
        font-semibold
        tracking-wider
        uppercase
        rounded-full
        bg-cyan-500/10
        border
        border-cyan-400/20
        text-cyan-300
        shadow-sm
      "
    >
      {children}
    </span>
  )
}