import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe"
import { Plan } from "@/generated/prisma";



export async function manageSubscription(
  subscriptionId: string,
  custumerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan
){
  
  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: custumerId
    }
  })

  if(!findUser){
    return Response.json({error: "Falha ao realizar assinatura"}, {status: 400})
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "BASIC"
  }

  if(subscriptionId && deleteAction){
    await prisma.subscription.delete({
      where: {
        id: subscriptionId
      }
    })

    
    return
  }

  if(createAction){
    try {
      
      await prisma.subscription.create({
        data: subscriptionData
      })

    } catch (error) {
      console.log('Erro ao salvar assinatura no banco')
    }
    
    

  }else{

    try {
      
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId
        }
      })

      if(!findSubscription) return

      await prisma.subscription.update({
        where: {
          id: findSubscription.id
        },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
        }
      })

    } catch (error) {
      console.log('Falha ao atualizar assinatura no banco')
    }

    
  }

}