"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import z from "zod"
import { revalidatePath } from "next/cache"

const formSchema = z.object({
  name: z.string().min(1, {message: "O nome é obrigatorio"}),
  price: z.number().min(1, {message: "O preco é obrigatorio"}),
 duration: z.number()
})

type FormShema = z.infer<typeof formSchema> 

export async function createNewService(formdata: FormShema) {
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

    const newService = await prisma.service.create({
      data: {
        name: formdata.name,
        price: formdata.price,
        duration: formdata.duration,
        userId: session?.user?.id
      }})

      revalidatePath('/dashboard/services')

    return {
      data: newService
    }
    
  } catch (error) {
    console.log(error)
  }

}

