
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";


export async function GET(req: NextRequest) {

  const { searchParams } = req.nextUrl
  
  const userId = searchParams.get("userId")
  const dateParam = searchParams.get("date")

  if(!userId || !dateParam || userId === "null" || dateParam === "null"){ {
    return NextResponse.json({
      error: "Dados insuficientes"
    },
    {
      status: 400
    })
  }
  }

  try {
    const [ year, month, day ] = dateParam.split('-').map(Number)
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59))

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if(!user){
      return NextResponse.json({
        error: "Dados insuficientes"
      },
      {
        status: 400
      })
    }

    const timesArray = user.times || [];

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        service: true
      }
    })

    const blockedSlots = new Set<string>()

    for(const apt of appointments){
      const requiredSlots = Math.ceil(apt.service.duration / 30)
      const startIndex = timesArray.indexOf(apt.time)

      if(startIndex !== -1){
        for(let i = 0; i < requiredSlots; i++){
          const blockedSlot = timesArray[startIndex + i]
          if(blockedSlot){
            blockedSlots.add(blockedSlot)
          } 
        }
      }
    }

    const blockedtimes = Array.from(blockedSlots)

    console.log("blockedtimes", blockedtimes)

    return NextResponse.json({
      blockedtimes
    })

  } catch (error) {
    return NextResponse.json({
      error: "Dados insuficientes"
    },
    {
      status: 400
    })
  }
}