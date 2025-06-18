"use client"

import { useEffect, useState } from "react"
import { ProfileFormData ,useProfileForm } from "./profile-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import  imagTest from "../../../../../../public/Doctor_hero.webp"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Prisma } from "@/generated/prisma";
import { updateProfile } from "../_actions/update-profile"
import { toast } from "sonner"
import { formatPhone } from "@/utils/formatPhone"
import { TrialBanner } from "../../_components/TrialBanner"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"
import { AvatarProfile } from "./profile-avatar"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}> 

interface ProfileContentProps {
  user: UserWithSubscription,
  permissions: ResultPermissionProp
}

export function ProfileContent({user, permissions}: ProfileContentProps){
  
  const [selectedhour, setSelectedHour] = useState<string[]>(user.times || []);
  const [dialogOpen, setDialogOpen] = useState(false)

  const [hasFutureAppointments, setHasFutureAppointments] = useState(false);

    useEffect(() => {
      fetch("/api/clinic/appointments/check-future")
        .then(res => res.json())
        .then(json => setHasFutureAppointments(json.hasFuture));
    }, []);

    


  const form = useProfileForm({
    name: user.name,
    address: user.address,
    timeZone: user.timeZone,
    status: user.status,
    phone: user.phone
  })
  


  function generatedTimeSlots(): string[]{
    const hours: string[] = []

    for(let i = 8; i <= 24; i++){
      for(let j = 0; j < 2; j++){
        const hour = i.toString().padStart(2, "0")
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
    }

    return hours
  }

  const hours = generatedTimeSlots()

  function toglgleHour(hour: string){
    setSelectedHour((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
  }

  const brazilCities = [
  'Sao_Paulo',
  'Salvador',
  'Bahia',
  'Recife',
  'Campo_Grande',
  'Rio_Branco',
  'Fortaleza',
  'Belem',
  'Manaus',
  'Boa_Vista',
  'Porto_Velho',
  'Maceio',
  'Araguaina',
  'Eirunepe',
  'Noronha'
];

const timeZone = Intl.supportedValuesOf('timeZone').filter(
  (zone) => zone.startsWith('America/') &&
            brazilCities.some((city) => zone.endsWith(city))
);


  async function onSubmit(values: ProfileFormData) {
   
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone: values.timeZone,
      times: selectedhour
    })

    if(response.error){
      toast.error(response.error)
      return 
    }

    toast.success(response.data)
  }


  return (
    <>
      {permissions.planId === "TRIAL" && !permissions.expired && (
        <TrialBanner permissions={permissions} />
      )}

    <div className="mx-auto">
      <Form {... form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
              </CardHeader>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <AvatarProfile
                  userId={user.id}
                  avatarUrl={user.image}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Nome completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o nome da clinica"/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o endereço da clinica"/>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} 
                        placeholder="(99) 99999-9999"
                        onChange={(e) =>{
                          const formattedValue = formatPhone(e.target.value)
                          field.onChange(formattedValue)
                        }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Status da Clinica</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clinica"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo (Clinica aberta)</SelectItem>
                            <SelectItem value="inactive">Inativo (Clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="font-semibold">
                    Configurar horarios da clinica
                  </Label>

                   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-between"
                          disabled={hasFutureAppointments}
                        >
                          {hasFutureAppointments
                            ? "Horários bloqueados (agendamentos futuros)"
                            : "Clique aqui pra selecionar os horários"}
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </DialogTrigger>

                      {!hasFutureAppointments && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Horários da clínica</DialogTitle>
                            <DialogDescription>
                              Selecione abaixo os horários de funcionamento da clínica
                            </DialogDescription>
                          </DialogHeader>

                          <section className="py-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              Selecione os horários abaixo
                            </p>

                            <div className="grid grid-cols-5 gap-2">
                              {hours.map((hour) => (
                                <Button
                                  key={hour}
                                  variant={"outline"}
                                  className={cn(
                                    "h-10",
                                    selectedhour.includes(hour) &&
                                      "border-2 border-emerald-500 text-primary"
                                  )}
                                  onClick={() => toglgleHour(hour)}
                                >
                                  {hour}
                                </Button>
                              ))}
                            </div>
                          </section>

                          <Button onClick={() => setDialogOpen(false)} className="w-full">
                            Salvar horários
                          </Button>
                        </DialogContent>
                      )}
                    </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Selecione um fuzo horario</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o seu fuzo horario"/>
                          </SelectTrigger>
                          <SelectContent>
                            {timeZone.map((zone) => {
                              const label = zone.replace('America/', '').replace('_', ' ')

                              return (
                                <SelectItem key={zone} value={zone}>
                                  {label}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400">Salvar</Button>
              </div>
            </CardContent>
          </Card>
        </form>

      </Form>
    </div>
    </>
  )
}