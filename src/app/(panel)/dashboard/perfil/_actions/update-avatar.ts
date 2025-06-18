"use server"

import prisma  from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateProfileAvatar({avatarUrl}: {avatarUrl: string}) {

  const session = await auth()

  if(!session?.user?.id){
    return {
      error: "Nao autorizado"
    }
  }

  if(!avatarUrl){
    return {
      error: "Falha ao alterar imagem"
    }
  }
  
  try {

    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        image: avatarUrl
      }
    })

    revalidatePath('/dashboard/perfil')

    return {
      data: "Imagem alterada com sucesso"
    }

    
    
  } catch (error) {
    return {
      error: "Ocorreu um erro ao alterar imagem"
    }
  }


}