"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cancelAppointment } from "../../_actions/cancel-appointment"
import type { AppointmentWithService } from "./appointments-list"

interface CancelAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: AppointmentWithService | null
  onCancelSuccess: () => void
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onCancelSuccess,
}: CancelAppointmentModalProps) {
  const [cancelReason, setCancelReason] = useState("")

  // limpar motivo quando modal abrir
  useEffect(() => {
    if (isOpen) {
      setCancelReason("")
    }
  }, [isOpen])

  async function handleConfirm() {
    if (!appointment) return

    if (!cancelReason.trim()) {
      toast.error("Informe o motivo do cancelamento")
      return
    }

    const response = await cancelAppointment({
      appointmentId: appointment.id,
      reason: cancelReason.trim(),
    })

    if (response?.error) {
      toast.error(response.error)
    } else {
      toast.success("Agendamento cancelado com sucesso")
      onCancelSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Cancelamento</DialogTitle>
          <DialogDescription>
            Ao cancelar o agendamento será enviado um email para o cliente.
            <br />
            Por favor, informe o motivo do cancelamento:
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="w-full border rounded p-2 mt-2"
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Motivo do cancelamento"
        />
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!cancelReason.trim()} onClick={handleConfirm}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
