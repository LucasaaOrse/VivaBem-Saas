
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppointmentWithService } from "./appointments-list"
import { format } from "date-fns"
import { formatCurrency } from "@/utils/format-currency"
import { formatDateUTC } from "@/utils/format-date"

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null
}
export function DialogAppointment({appointment}: DialogAppointmentProps) {
  

  return(
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dados do agendamento</DialogTitle>
        <DialogDescription>
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div>
        {appointment && (
          <article>
            <p><span className="font-semibold">Horario do agendamento: </span>{appointment.time}</p>
            <p className="mb-2"><span className="font-semibold">Data do agendamento: </span>{formatDateUTC(appointment.appointmentDate)}</p>
            <p><span className="font-semibold">Nome: </span>{appointment.name}</p>
            <p><span className="font-semibold">Telefone: </span>{appointment.phone}</p>
            <p><span className="font-semibold">Email: </span>{appointment.email}</p>

            <section className="bg-gray-100 p-2 mt-4 rounded-md">
              <p><span className="font-semibold">Serviço: </span>{appointment.service.name}</p>
              <p><span className="font-semibold">Preço: </span>{formatCurrency(appointment.service.price / 100)}</p>
            </section>
          </article>
        )}
      </div>
    </DialogContent>
  )
}