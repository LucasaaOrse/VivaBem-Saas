// app/api/verify-email/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token || !email) {
    return NextResponse.json({ success: false, error: "Dados inválidos." }, { status: 400 })
  }

  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      token,
    },
  })

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ success: false, error: "Token expirado ou inválido." }, { status: 400 })
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  })

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/login?verified=true`)
}
