"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

const formSchema = z.object({
  appointmentId: z.string().min(1, {message: "O id do agendamento é obrigatório"}),
  reason: z.string().min(1, {message: "O motivo do cancelamento é obrigatório"})
})

type FormSchema = z.infer<typeof formSchema>

export async function cancelAppointment(formData: FormSchema){
  const schema = formSchema.safeParse(formData)

  const session = await auth()

  if(!session?.user?.id){
    return{
      error: "Não autorizado"
    }
  }

  if(!schema.success){
    return{
      error: schema.error.issues[0].message
    }
  }

  try {
    // Aqui você pode simular o envio do email, por exemplo:
    console.log(`Enviar email para o cliente do agendamento ${formData.appointmentId} com o motivo: ${formData.reason}`)

    await prisma.appointment.delete(
      {
        where: {
          id: formData.appointmentId,
          userId: session?.user?.id
        }
      }
    )

    revalidatePath('/dashboard') // Revalida o cache do dashboard

    return {
      data: "Agendamento cancelado com sucesso"
    }

  } catch (error) { 
    console.log(error)
    return { error: "Ocorreu um erro ao deletar o agendamento" }
  }
}
