"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ScheduleContent } from "../../(public)/clinic/[id]/_components/schedule-content"

export default function ReschedulePage() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")

  const [clinic, setClinic] = useState(null)

  useEffect(() => {
    async function loadClinic() {
      if (!appointmentId) return

      const res = await fetch(`/api/clinic/appointments/${appointmentId}`)
      const appointment = await res.json()

      if (!appointment?.userId) return

      const clinicRes = await fetch(`/api/clinic/${appointment.userId}`)
      const clinicData = await clinicRes.json()
      setClinic(clinicData)
    }

    loadClinic()
  }, [appointmentId])

  if (!appointmentId) {
    return <p className="p-4 text-red-500">Agendamento inválido ou link expirado.</p>
  }

  if (!clinic) {
    return <p className="p-4">Carregando dados da clínica...</p>
  }

  return (
    <ScheduleContent
      clinic={clinic}
      mode="reschedule"
      appointmentId={appointmentId}
    />
  )
}
