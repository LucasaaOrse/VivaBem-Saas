"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, {message: "O nome é obrigatorio"}),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string().min(1, {message: "O horario é obrigario"}),
  times: z.array(z.string())

})

type FormShema = z.infer<typeof formSchema>

export async function updateProfile(formdata: FormShema) {

  const session = await auth()

  if(!session?.user?.id){
    return{
      error: "Nao autorizado"
    }
  }

  const upcoming = await prisma.appointment.findFirst({
  where: {
    userId: session.user.id,
    appointmentDate: { gte: new Date() },
  }
});

if (upcoming) {
  return {
    error: "Não é possível alterar os horários: existem agendamentos futuros.",
  };
}

  const shema = formSchema.safeParse(formdata)

  if(!shema.success){
    return{
      error: "Formulario invalido"
    }
  }

 try {

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      name: formdata.name,
      address: formdata.address,
      phone: formdata.phone,
      status: formdata.status,
      timeZone: formdata.timeZone,
      times: formdata.times || []
    }
  })

  revalidatePath("/dashboard/perfil")

  return {
    data: "Clinica atualizada com sucesso"
  }
  

 } catch (error) {
  console.log(error)
  return{
    error: "Falha ao atualizar a clinica"
  }
 }
    
}