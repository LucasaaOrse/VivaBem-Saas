"use client"

import Image from "next/image"
import imgtest from "../../../../../../public/Doctor_hero.webp"
import { Loader2, MapPin } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { useAppointmentForm, AppointmentFormData } from "./schedule-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formatPhone } from "@/utils/formatPhone"
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useCallback, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { ScheduleTimeList } from "./schedule.-time-list"
import { createNewAppointment } from "../_actions/create-appointment"
import { rescheduleAppointment } from "../_actions/reschedule-appointment"
import { toast } from "sonner"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscription: true;
  };
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
  mode?: "create" | "reschedule"
  appointmentId?: string
}

export interface TimeSlots {
  time: string,
  avalible: boolean
}

export function ScheduleContent({ clinic, mode = "create", appointmentId }: ScheduleContentProps) {

  const form = useAppointmentForm()
  const { watch, setValue } = form

  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("")
  const [avalibeTimeSlots, setAvalibeTimeSlots] = useState<TimeSlots[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [blockedTimes, setBlockedTimes] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [appointmentSuccess, setAppointmentSuccess] = useState(false)
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  })

  // Preenche campos no modo reschedule (readonly)
  useEffect(() => {
    if (mode === "reschedule" && appointmentId) {
      async function fetchAppointment() {
        try {
          const res = await fetch(`/api/clinic/appointments/${appointmentId}`)
          if (!res.ok) throw new Error("Falha ao buscar agendamento")
          const data = await res.json()
          setValue("name", data.name)
          setValue("email", data.email)
          setValue("phone", data.phone)
          setValue("serviceId", data.serviceId)
          setValue("date", new Date()) // Pode ajustar para data atual ou a data original do agendamento
          setSelectedTime(data.time || "")
        } catch (error) {
          console.error(error)
          toast.error("Erro ao carregar dados do agendamento")
        }
      }
      fetchAppointment()
    }
  }, [mode, appointmentId, setValue])

  async function handlesubmitAppointment(formData: AppointmentFormData) {
    if (!selectedTime) {
      toast.error("Selecione um horário")
      return
    }

    setIsSubmitting(true)

    const response = mode === "reschedule"
      ? await rescheduleAppointment({
          oldAppointmentId: appointmentId!,
          newDate: formData.date,
          newTime: selectedTime,
        })
      : await createNewAppointment({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          serviceId: formData.serviceId,
          time: selectedTime,
          clinicId: clinic.id,
        })

    if (response.error) {
      toast.error(response.error)
      setIsSubmitting(false)
      return
    }

    const serviceName = clinic.services.find(s => s.id === formData.serviceId)?.name || ""

    setAppointmentData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date.toLocaleDateString(),
      time: selectedTime,
      service: serviceName,
    })

    setAppointmentSuccess(true)
    form.reset()
    setSelectedTime("")
    setIsSubmitting(false)
  }

  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true)
    try {
      const dateString = date.toISOString().split('T')[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedules/get-appointments?userId=${clinic.id}&date=${dateString}`)
      const json = await response.json()
      setLoadingSlots(false)
      return json.blockedtimes || []
    } catch (error) {
      setLoadingSlots(false)
      console.error(error)
      return []
    }
  }, [clinic.id])

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked)
        const times = clinic.times ? JSON.parse(clinic.times) as string[] : []

        const finalSlots = times.map(time => ({
          time: time,
          avalible: !blocked.includes(time)
        }))

        setAvalibeTimeSlots(finalSlots)

        const stillAvalible = finalSlots.some(slot => slot.time === selectedTime && slot.avalible)

        if (!stillAvalible) {
          setSelectedTime("")
        }
      })
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  if (appointmentSuccess) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-emerald-600 mb-4">Agendamento concluído!</h1>
        <p className="text-gray-700 mb-2">Seu agendamento foi realizado com sucesso.</p>
        <p className="text-gray-600 mb-6">
          Um e-mail de confirmação foi enviado para <strong>{appointmentData.email}</strong>.
          Verifique sua caixa de entrada e spam.
        </p>

        <div className="text-left space-y-2 mb-6">
          <p><strong>Nome:</strong> {appointmentData.name}</p>
          <p><strong>Email:</strong> {appointmentData.email}</p>
          <p><strong>Telefone:</strong> {appointmentData.phone}</p>
          <p><strong>Data:</strong> {appointmentData.date}</p>
          <p><strong>Horário:</strong> {appointmentData.time}</p>
          <p><strong>Serviço:</strong> {appointmentData.service}</p>
        </div>

        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-400"
          onClick={() => setAppointmentSuccess(false)}
        >
          Voltar
        </Button>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500"></div>

      <section className="container mx-auto px-4 -mt-12">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image
                src={clinic.image ?? imgtest}
                alt="Foto da clínica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{clinic.address ?? "Endereço não encontrado"}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-5">
        {clinic.services.length === 0 ? (
          <div className="bg-white p-6 rounded-md shadow-sm border text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-2">
              Nenhum serviço disponível
            </h2>
            <p className="text-gray-600">
              Esta clínica ainda não cadastrou nenhum serviço. Por favor, volte mais tarde.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
              onSubmit={form.handleSubmit(handlesubmitAppointment)}
            >
              {mode !== "reschedule" && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Nome completo</FormLabel>
                        <FormControl>
                          <Input {...field} id="name" placeholder="Seu nome completo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input {...field} id="email" placeholder="Digite seu email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Telefone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="phone"
                            placeholder="Ex: (99) 99999-9999"
                            onChange={(e) => {
                              const formattedValue = formatPhone(e.target.value)
                              field.onChange(formattedValue)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceId"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-1">
                        <FormLabel className="font-semibold">Selecione o Serviço</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                            <SelectContent>
                              {clinic.services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-1">
                    <FormLabel className="font-semibold">Data da consulta</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        initialDate={new Date()}
                        className="w-full rounded border p-2"
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date)
                          }
                        }}

                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedServiceId && (
                <div className="space-y-2">
                  <Label className="font-semibold">Horários disponíveis:</Label>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {loadingSlots ? (
                      <p>Carregando...</p>
                    ) : avalibeTimeSlots.length === 0 ? (
                      <p>Nenhum horário disponível</p>
                    ) : (
                      <ScheduleTimeList
                        clinicTimes={clinic.times ? JSON.parse(clinic.times) as string[] : []}
                        blockedTimes={blockedTimes}
                        availableTimesSlots={avalibeTimeSlots}
                        selectedTime={selectedTime}
                        selectedDate={selectedDate}
                        requiredSlots={
                          clinic.services.find((service) => service.id === selectedServiceId)
                            ? Math.ceil(clinic.services.find((service) => service.id === selectedServiceId)!.duration / 30)
                            : 1
                        }
                        onSelectedTime={(time) => setSelectedTime(time)}
                      />
                    )}
                  </div>
                </div>
              )}

              {clinic.status ? (
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400"
                  disabled={
                    isSubmitting ||
                    !watch("date") ||
                    !selectedTime ||
                    (mode !== "reschedule" &&
                      (!watch("name") || !watch("email") || !watch("phone") || !watch("serviceId")))
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {mode === "reschedule" ? "Reagendando..." : "Agendando..."}
                    </>
                  ) : mode === "reschedule" ? "Confirmar Reagendamento" : "Agendar"}
                </Button>
              ) : (
                <p className="text-red-500 text-center px-4 py-2">
                  Clínica Fechada no momento
                </p>
              )}
            </form>
          </Form>
        )}
      </section>
    </div>
  )
}
