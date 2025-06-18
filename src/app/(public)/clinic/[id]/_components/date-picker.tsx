"use client"


import DatePicker, { registerLocale } from "react-datepicker"
import { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { ptBR } from "date-fns/locale/pt-BR"

registerLocale("pt-BR", ptBR)

interface DateTimePickerProps {
  minDate?: Date
  className?: string
  initialDate?: Date
  onChange: (date: Date) => void
}


export function DateTimePicker({ initialDate, minDate, className, onChange}: DateTimePickerProps) {
  const [startDate, setStartDate] = useState( initialDate || new Date())

  function handleChange(date: Date | null) {
    if(date){
      setStartDate(date)
      onChange(date)
    }
  }

  return (
    <DatePicker
      className={className}
      selected={startDate}
      locale="pt-BR"
      onChange={handleChange}
      minDate={minDate ?? new Date()}
      dateFormat="dd/MM/yyyy"

    />
  )
}
