"use client"


export function ButtonPickerMonth({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="month"
      className="border p-1 rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
