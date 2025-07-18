// app/api/clinic/_actions/confirm-appointment.ts
"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function confirmAppointment(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Não autorizado" }
  }

  try {
    const appointment = await prisma.appointment.update({
      where: {
        id,
        userId: session.user.id,
        status: "PENDING",
      },
      data: {
        status: "CONFIRMED",
      },
    })

    revalidatePath("/dashboard")

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clinic/appointments/confirm-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appointmentId: appointment.id }),
    })


    return { success: true }
  } catch (err) {
    return { error: "Erro ao confirmar agendamento" }
  }
}
