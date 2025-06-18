"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

const formSchema = z.object({
  description: z.string().min(1, {message: "A descrição do lembrete é obrigatoria"}),
})

type FormSchema = z.infer<typeof formSchema>

export async function createReminder(formData: FormSchema) {

  const schema = formSchema.safeParse(formData)

  const session = await auth()

  if(!session?.user?.id){
    return{
      error: "Nao autorizado"
    }
  }

  if(!schema.success){
    return{
      error: schema.error.issues[0].message
    }
  }

  

  try {
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session?.user?.id
      }
    })

    revalidatePath('/dashboard')

    return {
      data: "Lembrete criado com sucesso"
    }
  } catch (error) { 
    console.log(error)
    return{error: "Ocorreu um erro ao criar o lembrete"}
  }
}
