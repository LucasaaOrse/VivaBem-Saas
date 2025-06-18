"use server"

import prisma from "@/lib/prisma"

export default async function getAllServices({userId}: {userId: string}){
  if(!userId){
    return {
      error: "Nao autorizado"
    }
  }

  try {

    const services = await prisma.service.findMany({where: {userId: userId, status: true}})
    return {
      data: services
    }
    
    
  } catch (error) {
    return {
      error: "Nao autorizado"
    }
  }
  
}