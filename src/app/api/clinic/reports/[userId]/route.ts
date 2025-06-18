import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

interface ByDateItem {
  date: string | Date;
  count: number;
}

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const params = await context.params
  const userId = params.userId

  // Pega mês da URL (ex: ?month=2025-06)
  const { searchParams } = new URL(req.url)
  const monthParam = searchParams.get("month") // "2025-06"

  let startDate: Date | undefined
  let endDate: Date | undefined

  if (monthParam) {
    const [year, month] = monthParam.split("-").map(Number)
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0, 23, 59, 59)
  }

  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined

  // Lista de serviços (para nomes e preços)
  const services = await prisma.service.findMany({
    where: { userId },
    select: { id: true, name: true, price: true },
  })

  // Total de agendamentos
  const totalAppointments = await prisma.appointment.count({
    where: {
      userId,
      appointmentDate: dateFilter,
    },
  })

  // Agendamentos por serviço
  const byService = await prisma.appointment.groupBy({
    by: ["serviceId"],
    where: {
      userId,
      appointmentDate: dateFilter,
    },
    _count: { _all: true },
  })

  // Agendamentos por dia
  const byDateRaw = await prisma.appointment.findMany({
    where: {
      userId,
      appointmentDate: dateFilter,
    },
    select: {
      appointmentDate: true,
    },
  })

console.log(byDateRaw);

// Agrupa por data no formato YYYY-MM-DD
const dateMap: Record<string, number> = {}

for (const appt of byDateRaw) {
  const date = appt.appointmentDate.toISOString().split("T")[0] // "2025-06-18"
  dateMap[date] = (dateMap[date] || 0) + 1
}

// Transforma em array para o gráfico
const byDate = Object.entries(dateMap).map(([date, count]) => ({
  date,
  count,
}))

console.log(byDate);

  return NextResponse.json({
    totalAppointments: Number(totalAppointments),
    byService: byService.map((item) => {
      const service = services.find((s) => s.id === item.serviceId)
      return {
        name: service?.name || "Desconhecido",
        price: service?.price || 0,
        count: Number(item._count._all),
      }
    }),
    byDate,
  })
}
