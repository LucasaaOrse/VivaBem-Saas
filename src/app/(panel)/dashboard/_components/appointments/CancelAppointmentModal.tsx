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
import type { AppointmentWithService } from "./appointments-list"
import { cancelAppointment } from "../../_actions/cancel-appointment"

interface CancelAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: AppointmentWithService | null
  onCancelSuccess: () => void
}

const CANCEL_REASONS = [
  "Profissional indisponível",
  "Problemas técnicos",
  "Conflito de horário",
  "Feriado ou recesso",
  "Outro",
]

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onCancelSuccess,
}: CancelAppointmentModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [cancelType, setCancelType] = useState<"CANCEL" | "RESCHEDULE" | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSelectedReason("")
      setCustomReason("")
      setCancelType("")
    }
  }, [isOpen])

  async function handleConfirm() {
    if (!appointment) return

    const finalReason =
      selectedReason === "Outro" ? customReason.trim() : selectedReason

    if (!finalReason || !cancelType) {
      toast.error("Informe o motivo e o tipo de cancelamento")
      return
    }

    setIsSubmitting(true)

    const result = await cancelAppointment({
      appointmentId: appointment.id,
      reason: finalReason,
      cancelType,
    })

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Agendamento cancelado e e-mail enviado com sucesso")
      onCancelSuccess()
      onClose()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Cancelamento</DialogTitle>
          <DialogDescription>
            Escolha o motivo e o tipo de cancelamento. Um e-mail será enviado ao cliente com as informações.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          <p className="font-semibold">Motivo do cancelamento:</p>
          {CANCEL_REASONS.map((reason) => (
            <label key={reason} className="flex items-center space-x-2">
              <input
                type="radio"
                name="cancel-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
              />
              <span>{reason}</span>
            </label>
          ))}

          {selectedReason === "Outro" && (
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Descreva o motivo"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          <p className="mt-4 font-semibold">Tipo de cancelamento:</p>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="cancel-type"
              value="CANCEL"
              checked={cancelType === "CANCEL"}
              onChange={() => setCancelType("CANCEL")}
            />
            <span>Apenas cancelar</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="cancel-type"
              value="RESCHEDULE"
              checked={cancelType === "RESCHEDULE"}
              onChange={() => setCancelType("RESCHEDULE")}
            />
            <span>Cancelar e remarcar</span>
          </label>
        </div>

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={
              !selectedReason ||
              (selectedReason === "Outro" && !customReason.trim()) ||
              !cancelType ||
              isSubmitting
            }
            onClick={handleConfirm}
          >
            {isSubmitting ? "Enviando..." : "Confirmar Cancelamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
