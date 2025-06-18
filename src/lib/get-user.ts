// lib/get-user.ts
import prisma from "./prisma"
import { comparePassword } from "@/utils/password"

export async function getUserFromDb(email: string, password: string): Promise<any> {
  const user = await prisma.user.findFirst({
    where: {
      email: email
    },
  })

  // Verifica se o usuário existe e tem senha cadastrada
  if (!user || !user.password) {
    return null
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // Retorna o usuário (sem senha, por segurança)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  }
}
