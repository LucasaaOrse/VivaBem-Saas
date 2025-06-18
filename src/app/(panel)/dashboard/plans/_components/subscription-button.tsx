"use client"

import { Button } from "@/components/ui/button"
import { Plan } from "@/generated/prisma"
import { createSubscription } from "../_actions/create-subscription"
import { toast } from "sonner"
import { getStripeJs } from "@/utils/stripe-js"

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({type}: SubscriptionButtonProps) {

  async function handleCreateBilling() {
    const response = await createSubscription({type: type})


    if(response?.error){
      toast.error(response.error)
      return
    }

    const stripe = await getStripeJs()

    if(stripe){
      await stripe.redirectToCheckout({sessionId: response.sessionId})
    }


  }
  return (
    <Button 
      className={`w-full ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400 "}}`}
      onClick={handleCreateBilling}
    >
      Ativar assinatura
    </Button>
  )
}