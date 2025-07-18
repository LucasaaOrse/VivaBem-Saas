// src/app/(panel)/_actions/cancel-appointment.ts
"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { sendEmailViaService } from "@/lib/send-email"

const formSchema = z.object({
  appointmentId: z.string().min(1),
  reason: z.string().min(1),
  cancelType: z.enum(["CANCEL", "RESCHEDULE"]),
})

type FormSchema = z.infer<typeof formSchema>

export async function cancelAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Não autorizado" }
  }

  const { appointmentId, reason, cancelType } = schema.data

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
      userId: session.user.id,
    },
    include: {
      service: true,
    },
  })

  if (!appointment) {
    return { error: "Agendamento não encontrado" }
  }

  try {
    const template = cancelType === "RESCHEDULE" ? "cancel-reschedule" : "cancel-appointment"
    const subject = cancelType === "RESCHEDULE"
      ? "Sua consulta foi cancelada. Reagende agora."
      : "Sua consulta foi cancelada."

    await sendEmailViaService({
      to: appointment.email,
      subject,
      template,
      variables: {
        name: appointment.name,
        serviceName: appointment.service.name,
        date: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(appointment.appointmentDate)),
        time: appointment.time,
        reason,
        rescheduleLink: `${process.env.NEXT_PUBLIC_API_URL}/reschedule?appointmentId=${appointment.id}`,
      },
    })

    await prisma.appointment.update({
      where: {
        id: appointmentId,
        userId: session.user.id,
      },
      data: {
        status: "CANCELLED",
      },
    })

    revalidatePath("/dashboard")

    return { data: "Agendamento cancelado com sucesso" }
  } catch (err) {
    console.error("Erro ao cancelar e enviar email:", err)
    return { error: "Erro ao processar cancelamento" }
  }
}
