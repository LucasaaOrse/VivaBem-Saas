"use client"
import { useEffect, useRef, useState } from "react"
import { formatCurrency } from "@/utils/format-currency"

interface AnimatedCurrencyProps {
  value: number // valor em centavos
  duration?: number // duração da animação em ms
}

export default function AnimatedCurrency({ value, duration = 800 }: AnimatedCurrencyProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const startValue = useRef(value)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    startValue.current = displayValue
    startTime.current = null

    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const progress = timestamp - startTime.current
      const percent = Math.min(progress / duration, 1)
      const current = Math.round(startValue.current + (value - startValue.current) * percent)
      setDisplayValue(current)

      if (percent < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [value, duration])

  return <span>{formatCurrency(displayValue / 100)}</span>
}
