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
        p-4
        rounded-lg
        text-white
        font-medium
        ${
          type === "success"
            ? "bg-green-500"
            : "bg-red-500"
        }
      `}
    >
      {message}
    </div>
  )
}