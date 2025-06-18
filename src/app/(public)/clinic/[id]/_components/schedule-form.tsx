"use client"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const appointmentFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatorio"),
  email: z.string().email("O email é obrigatorio"),
  phone: z.string().min(1, "O telefone é obrigatorio"),
  date: z.date(),
  serviceId: z.string().min(1, "O servico é obrigatorio")
})

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>

export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      date: new Date(),
    }
  })
} 