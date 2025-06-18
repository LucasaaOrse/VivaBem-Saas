"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
 
const formSchema = z.object({
  reminderId: z.string().min(1, {message: "O id do lembrete é obrigatorio"})
})

type FormSchema = z.infer<typeof formSchema>

export async function deleteReminder({reminderId}: FormSchema) {
  
  const schema = formSchema.safeParse({reminderId})


  if(!schema.success){
    return{
      error: schema.error.issues[0].message
    }
  }


  try {
    await prisma.reminder.delete({where: {id: reminderId}})

    revalidatePath('/dashboard')

    return {
      data: "Lembrete deletado com sucesso"
    }
  } catch (error) { 
    console.log(error)
    return{error: "Ocorreu um erro ao deletar o lembrete"}
  }
} 


