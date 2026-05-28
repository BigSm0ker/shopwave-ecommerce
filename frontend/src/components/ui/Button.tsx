interface ButtonProps {
  children: React.ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  children,
  type = "button",
  disabled = false,
  onClick
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
        px-4
        py-2
        rounded-lg
        bg-[var(--secondary)]
        text-white
        hover:bg-[var(--secondary-hover)]
        transition-all
        duration-300
        hover:scale-[1.02]
        shadow-sm
        hover:shadow-md
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  )
}