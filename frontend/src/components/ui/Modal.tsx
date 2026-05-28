"use client"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          w-full
          max-w-lg
          p-6
          shadow-xl
        "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}