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
        bg-slate-950/80
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      <div
        className="
          bg-slate-900/95
          border
          border-white/10
          rounded-3xl
          w-full
          max-w-lg
          p-6
          shadow-2xl
          text-slate-100
        "
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="text-slate-300">
          {children}
        </div>
      </div>
    </div>
  )
}