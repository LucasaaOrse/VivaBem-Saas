// app/api/reschedule/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const { appointmentId, newDate, newTime } = body

  if (!appointmentId || !newDate || !newTime) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  try {
    // Buscar dados do agendamento antigo
    const oldAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!oldAppointment) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
    }

    // Criar novo agendamento com os mesmos dados + nova data e hora
    const created = await prisma.appointment.create({
      data: {
        userId: oldAppointment.userId,
        name: oldAppointment.name,
        email: oldAppointment.email,
        serviceId: oldAppointment.serviceId,
        phone: oldAppointment.phone,
        appointmentDate: newDate,
        time: newTime,
        status: "PENDING", // status inicial pode ser pendente ou conforme seu fluxo
      },
    })

    return NextResponse.json({ success: true, created })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao reagendar" }, { status: 500 })
  }
}
