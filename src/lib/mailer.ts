import prisma from "./prisma"
import { v4 as uuidv4 } from "uuid"
import { generateVerifyEmailHTML } from "./emails/verify-email"
import nodemailer from "nodemailer"

export async function sendVerificationEmail(email: string) {
  const token = uuidv4()

  // Salva token no banco
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    },
  })

  const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/confirm-email?token=${token}`

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fa8170f1de2ecd", // Seu usuário Mailtrap
      pass: "f1e9c2a13bed89", // Sua senha Mailtrap
    },
  })

  try {
    await transporter.sendMail({
      from: `"VivaBem" <register@vivabem.com>`,  // Email "from" fixo para teste
      to: email,
      subject: "Confirme seu e-mail",
      html: generateVerifyEmailHTML(verificationUrl),
    })
  } catch (error) {
    console.error("Erro ao enviar email de verificação:", error)
    throw error
  }
}
