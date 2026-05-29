interface AlertProps {
  message: string
  type?: "success" | "error"
}

export default function Alert({
  message,
  type = "success"
}: AlertProps) {
  return (
    <div
      className={`
        px-4
        py-3
        rounded-xl
        text-sm
        font-medium
        border
        ${
          type === "success"
            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
            : "border-red-400/30 bg-red-500/10 text-red-200"
        }
      `}
    >
      {message}
    </div>
  )
}