"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import z from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  serviceId: z.string().min(1, {message: "O id do serviço é obrigatorio"})
})

type FormShema = z.infer<typeof formSchema> 

export async function deleteService(formdata: FormShema) {
  const session = await auth()

  if(!session?.user?.id){
    return{
      error: "Nao autorizado"
    }
  }

  const shema = formSchema.safeParse(formdata)

  if(!shema.success){
    return{
      error: "Formulario invalido"
    }
  }


  try {

    const service = await prisma.service.update({
      where: {
        id: formdata.serviceId,
        userId: session?.user?.id
      },
      data: {
        status: false
      }})

      revalidatePath('/dashboard/services')

    return {
      data: service
    }
    
  } catch (error) {
    console.log(error)
  }

}