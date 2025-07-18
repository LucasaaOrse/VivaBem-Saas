"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plan } from "@/generated/prisma"
import { createSubscription } from "../_actions/create-subscription"
import { toast } from "sonner"
import { getStripeJs } from "@/utils/stripe-js"
import { Loader2 } from "lucide-react"

interface SubscriptionButtonProps {
  type: Plan
}

export function SubscriptionButton({type}: SubscriptionButtonProps) {

  const [loading, setLoading] = useState(false)

  async function handleCreateBilling() {
    setLoading(true)
    try {
      const response = await createSubscription({ type })

      if (response?.error) {
        toast.error(response.error)
        return
      }

      const stripe = await getStripeJs()
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: response.sessionId })
      }
    } catch (err) {
      toast.error("Erro ao redirecionar para o pagamento.")
    } finally {
      setLoading(false)
    }


  }
  return (
    <Button 
      disabled={loading}
      className={`w-full ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400 "}}`}
      onClick={handleCreateBilling}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? "Redirecionando..." : "Ativar assinatura"}
    </Button>
  )
}