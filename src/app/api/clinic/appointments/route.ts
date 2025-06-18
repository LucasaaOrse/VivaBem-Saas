
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";


export const GET = auth(async function (req) {
  if(!req.auth){
    return NextResponse.json({error: "Nao autorizado"}, {status: 401})
  }

  const seachParams = req.nextUrl.searchParams
  const dataString = seachParams.get("date") as string

  const clinicId = req.auth?.user?.id

  if(!dataString){
    return NextResponse.json({error: "Data nao informada"}, {status: 400})
  }

  if(!clinicId){
    return NextResponse.json({error: "Nao autorizado"}, {status: 401})
  }

  try {
    
    const [ year, month, day ] = dataString.split('-').map(Number)
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59))

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: true
      }
    })

    return NextResponse.json(appointments)

  } catch (error) {
    return NextResponse.json({error: "Ocorreu um erro ao buscar os agendamentos"}, {status: 500})
  }

})

