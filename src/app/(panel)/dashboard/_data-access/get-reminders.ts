"use server"

import prisma from "@/lib/prisma"

export async function getReminders({userId} : {userId: string}){

  if(!userId){
    return []
  }

  try {
    
    const reminders = await prisma.reminder.findMany({where: {userId: userId}})

    return reminders

  } catch (error) {
    console.log(error)
    return []
  }

}