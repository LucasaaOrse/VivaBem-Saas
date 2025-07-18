"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getPendingAppointments } from "../../_actions/get-pending-appointments"
import { confirmAppointment } from "../../_actions/confirm-appointment"
import { toast } from "sonner"
import { Prisma } from "@/generated/prisma"
import { ButtonPickerMonth } from "../ButtonPickerMonth"
import { formatDateUTC } from "@/utils/format-date"

type PendingAppointment = Prisma.AppointmentGetPayload<{
  include: { service: true }
}>

export function PendingAppointmentsList() {
  const queryClient = useQueryClient()

  // Novo estado para controlar o mês selecionado (ex: "2025-06")
  const [selectedMonth, setSelectedMonth] = useState(() =>
    format(new Date(), "yyyy-MM")
  )

  const { data, isLoading } = useQuery({
    queryKey: ["get-pending-appointments", selectedMonth],
    queryFn: () => getPendingAppointments(selectedMonth),
    refetchInterval: 30000,
  })

  async function handleConfirm(id: string) {
    const res = await confirmAppointment(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("Agendamento confirmado com sucesso.")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["get-pending-appointments", selectedMonth] }),
        queryClient.invalidateQueries({ queryKey: ["get-appointments"] }),
      ])
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl md:text-2xl">Agendamentos Pendentes</CardTitle>
        <ButtonPickerMonth value={selectedMonth} onChange={setSelectedMonth} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : data?.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum agendamento pendente para esse mês.</p>
          ) : (
            data?.map((appointment) => (
              <div
                key={appointment.id}
                className="border-t last:border-b py-2 px-2 flex justify-between items-center rounded bg-yellow-50 hover:bg-yellow-100 transition"
              >
                <div>
                  <p className="font-medium">{appointment.name}</p>
                  <p className="text-sm text-muted-foreground">{appointment.service.name}</p>
                  <p className="text-sm text-muted-foreground">Horário: {appointment.time}</p>
                  <p className="text-sm text-muted-foreground">
                    Data do agendamento: {formatDateUTC(appointment.appointmentDate)}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleConfirm(appointment.id)}>
                  Confirmar
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
