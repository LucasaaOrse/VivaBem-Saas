"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Prisma } from "@/generated/prisma"
import { Button } from "@/components/ui/button"
import { Eye, X } from "lucide-react"
import { cancelAppointment } from "../../_actions/cancel-appointment"
import { toast } from "sonner"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { DialogAppointment } from "./dialog-appointment"
import { ButtonPickerAppointment } from "./button-date"
import { CancelAppointmentModal } from "./CancelAppointmentModal"



export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true
  }
}>

interface AppointmentsListProps{
  times: string[],
  
}

export function AppointmentsList({ times }: AppointmentsListProps) {

  const searchParams = useSearchParams()
  const date = searchParams.get("date")

  const queryClient = useQueryClient()

  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<AppointmentWithService | null>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey:["get-appointments", date],
    queryFn: async () => {

      let activeDate = date

      if(!activeDate){
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)

      const json = await response.json() as AppointmentWithService[]

      if(!response.ok){
        return []
      }

      return json
    },
    refetchInterval: 30000
  })

  const occupantMap: Record<string, AppointmentWithService> = {}

  if(data && data.length > 0){
    for(const appointment of data){
      const requiredSlots = Math.ceil(appointment.service.duration / 30)

      const startIndex = times.indexOf(appointment.time)

      if(startIndex !== -1){
        for(let i = 0; i < requiredSlots; i++){
          const slotIndex = startIndex + i

          if(slotIndex < times.length){
            occupantMap[times[slotIndex]] = appointment
          }
      }
    }
  }
}

  return(
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl">Agendamentos</CardTitle>
      <ButtonPickerAppointment/>
      </CardHeader>
      <CardContent className="space-y-2">
        {times.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            Você ainda não definiu os horários de atendimento.<br />
            Acesse a <a href="/dashboard/perfil" className="text-gray-700 hover:underline">página de perfil</a> para configurar.
          </div>
        ) : (
          
        
        <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc[100vh-15rem] pr-4">
          {isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center py-2 border-t last:border-b">
                  <div className="w-16 h-4 bg-gray-200 animate-pulse rounded-md" />
                  <div className="flex-1 ml-2">
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md mb-1" />
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            times.map((slot) => {

              const occupant = occupantMap[slot]

              if(occupant){
                return(
                  <div
                  key={slot}
                  className="flex items-center py-2 border-t last:border-b"
                >
                  <div className="w-16 text-sm font-semibold">{slot}</div>
                  <div className="flex-1 text-sm ">
                    <div className="font-semibold" >{occupant.name}</div>
                    <div className="text-sm text-gray-500">{occupant.service.name}</div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex">
                     <DialogTrigger asChild> 
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDetailAppointment(occupant)}
                      >
                        <Eye/>
                      </Button>
                    </DialogTrigger> 
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAppointmentToCancel(occupant)
                        setCancelModalOpen(true)
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    </div>
                  </div>
                  
                 </div>
                 )
              }
           return(
            <div
            key={slot}
            className="flex items-center py-2 border-t last:border-b"
          >
            <div className="w-16 text-sm font-semibold">{slot}</div>
            <div className="flex-1 text-sm text-gray-500">Disponivel</div>
           </div>
           )
          })

           )}
        </ScrollArea>
        )}
      </CardContent>
      
    </Card>
    <DialogAppointment appointment={detailAppointment}/>
    <CancelAppointmentModal
  isOpen={cancelModalOpen}
  onClose={() => setCancelModalOpen(false)}
  appointment={appointmentToCancel}
  onCancelSuccess={async () => {
    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    await refetch()
  }}
/>
    
  </Dialog>
  )
}