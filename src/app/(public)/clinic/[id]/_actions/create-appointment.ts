"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatorio"),
  email: z.string().email("O email é obrigatorio"),
  phone: z.string().min(1, "O telefone é obrigatorio"),
  date: z.date(),
  serviceId: z.string().min(1, "O servico é obrigatorio"),
  time: z.string().min(1, "O horário é obrigatorio"),
  clinicId: z.string().min(1, "O clinica é obrigatorio"),
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)
  
  if(!schema.success){
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    
    const selectedDate = new Date(formData.date)

    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0))

    const newAppointment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointmentDate: appointmentDate,
        time: formData.time,
        serviceId: formData.serviceId,
        userId: formData.clinicId,
        status: "PENDING"
      }
    })

    return {
      data: newAppointment
    }

  } catch (error) {
    console.log(error)
    return {
      error: "Ocorreu um erro ao criar o agendamento"
    }
  }
}