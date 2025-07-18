"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { startOfMonth, endOfMonth } from "date-fns"

export async function getPendingAppointments(month?: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return []
  }

   let selectedDate: Date

  if (month) {
    const [year, monthIndex] = month.split("-").map(Number)
    // ⚠️ Lembrando que o mês é 0-based no JS (junho = 5)
    selectedDate = new Date(year, monthIndex - 1, 1)
  } else {
    const now = new Date()
    selectedDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const startDate = startOfMonth(selectedDate)
  const endDate = endOfMonth(selectedDate)

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: session.user.id,
      status: "PENDING",
      appointmentDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      service: true,
    },
    orderBy: {
      appointmentDate: "asc",
    },
  })

  return appointments
}
