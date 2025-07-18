// src/app/api/clinic/appointments/cancel/route.ts

import { NextResponse } from "next/server"
import { z } from "zod"
import { sendEmailViaService } from "@/lib/send-email"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

const cancelSchema = z.object({
  appointmentId: z.string().min(1),
  reason: z.string().min(1),
  cancelType: z.enum(["CANCEL", "RESCHEDULE"]),
})

export async function POST(req: Request) {
  console.log("🔵 Início da rota /cancel")
  const session = await auth()
  console.log("session cancel: ", session)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = cancelSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { appointmentId, reason, cancelType } = parsed.data

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
    return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
  }

  console.log("name", appointment.name)
  console.log("link", `${process.env.NEXT_PUBLIC_APP_URL}/reschedule?appointmentId=${appointment.id}`)


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
      name: appointment.name,           // para {{name}}
      date: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(appointment.appointmentDate)),
      time: appointment.time,
      reason,
      rescheduleLink: `${process.env.NEXT_PUBLIC_APP_URL}/reschedule?appointmentId=${appointment.id}`
    },
    })

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Erro ao cancelar e enviar email:", err)
    return NextResponse.json({ error: "Erro ao processar cancelamento" }, { status: 500 })
  }
}
