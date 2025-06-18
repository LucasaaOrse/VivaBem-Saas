// app/api/auth/confirm-email/route.ts
import { NextResponse } from "next/server"
import prisma from "./../../../../lib/prisma"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 })
  }

  // Buscar o token na tabela
  const verificationRecord = await prisma.verificationToken.findFirst({
    where: { token },
  })

  if (!verificationRecord) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 })
  }

  // Verificar se o token expirou
  if (verificationRecord.expires < new Date()) {
    // Deletar token expirado
    await prisma.verificationToken.delete({
      where: { 
        identifier_token: {
          identifier: verificationRecord.identifier,
          token
        }
       },
    })
    return NextResponse.json({ error: "Token expirado" }, { status: 400 })
  }

  // Atualizar o usuário para marcar email como verificado
  await prisma.user.update({
    where: { email: verificationRecord.identifier },
    data: { emailVerified: new Date() },
  })

  // Deletar o token para evitar reutilização
  await prisma.verificationToken.delete({
    where: { 
      identifier_token: {
        identifier: verificationRecord.identifier,
        token
        } },
  })

  return NextResponse.json({ success: true })
}
