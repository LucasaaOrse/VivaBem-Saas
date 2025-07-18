// src/app/api/clinic/appointments/confirm-email/route.ts

import { NextResponse } from "next/server"
import { sendEmailViaService } from "@/lib/send-email" // sua função já existente
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {

  const body = await req.json()
  const { appointmentId } = body

  if (!appointmentId) {
    return NextResponse.json({ error: "ID do agendamento é obrigatório" }, { status: 400 })
  }

  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
    },
    include: {
      service: true,
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
  }

  try {

    await sendEmailViaService({
      to: appointment.email,
      subject: "Seu agendamento foi confirmado!",
      template: "appointment-confirmation",
      variables: {
        name: appointment.name,
        date: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "UTC"
        }).format(new Date(appointment.appointmentDate)),
        time: appointment.time,
        service: appointment.service.name,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao enviar e-mail de confirmação:", error)
    return NextResponse.json({ error: "Erro ao enviar e-mail" }, { status: 500 })
  }
}
