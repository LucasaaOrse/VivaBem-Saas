import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

import { NextRequest } from "next/server"

export async function GET(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  try {
    const clinic = await prisma.user.findUnique({
      where: { id: id },
      include: {
        services: true,
        subscription: true,
      },
    })

    if (!clinic) {
      return NextResponse.json({ error: "Clínica não encontrada" }, { status: 404 })
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error("Erro ao buscar clínica:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
