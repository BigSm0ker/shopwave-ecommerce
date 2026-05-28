import React from "react"

interface InputProps {
  label: string
  name?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange
}: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-medium">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          border
          rounded-lg
          px-3
          py-2
          outline-none
          focus:ring-2
          focus:ring-black
        "
      />
    </div>
  )
}