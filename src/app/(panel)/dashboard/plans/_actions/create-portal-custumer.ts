"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { stripe } from "@/utils/stripe"


export async function createPortalCustumer(){
  const session = await auth()

  if(!session?.user?.id){
    return{
      sessionId: "",
      error: "Nao autorizado"
    }
  }

  const findUser = await prisma.user.findUnique({where: {id: session?.user?.id}})

  if(!findUser){
    return{
      sessionId: "",
      error: "Nao autorizado"
    }
  }

  const sessionId = findUser.stripe_customer_id

  if(!sessionId){
    return{
      sessionId: "",
      error: "Usuario não encontrado"
    }
  }

  try {
    
    const portalSession = await stripe.billingPortal.sessions.create({
    customer: sessionId,
    return_url: process.env.STRIPE_SUCCESS_URL
  })

  return {
    sessionId: portalSession.url
  }

  } catch (error) {
    console.log(error)
    return {
      sessionId: "",
      error: "Ocorreu um erro ao criar o portal"
    }
  }

}