// app/(panel)/_actions/reschedule-appointment.ts
"use server"

import prisma from "@/lib/prisma"

export async function rescheduleAppointment({
  oldAppointmentId,
  newDate,
  newTime,
}: {
  oldAppointmentId: string
  newDate: Date
  newTime: string
}) {
  try {
    const old = await prisma.appointment.findUnique({
      where: { id: oldAppointmentId },
    })

    if (!old) {
      return { error: "Agendamento não encontrado" }
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        name: old.name,
        email: old.email,
        phone: old.phone,
        appointmentDate: newDate,
        time: newTime,
        serviceId: old.serviceId,
        userId: old.userId,
        status: "PENDING",
      },
    })

    return { data: newAppointment }
  } catch (err) {
    console.error(err)
    return { error: "Erro ao reagendar" }
  }
}
