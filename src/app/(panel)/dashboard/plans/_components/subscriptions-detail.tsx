"use client"

import { Subscription } from "@/generated/prisma"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { subscriptionPlans } from "@/utils/plans/index"
import { Button } from "@/components/ui/button"
import { createPortalCustumer } from "../_actions/create-portal-custumer"


interface SubuscriptionsDetailProps {
  subscriptions: Subscription
}

export function SubscriptionsDetail({ subscriptions}: SubuscriptionsDetailProps) {

  const subscriptionInfo = subscriptionPlans.find((plan) => plan.id === subscriptions.plan)

  async function handleManageSubscription() {
    const portal = await createPortalCustumer()

    if(portal.error) {
      return toast.error(portal.error)
    }

    window.location.href = portal.sessionId
  }

  return (
    <Card>
      <CardHeader className="w-full mx-auto">
        <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
        <CardDescription>Sua assinatura esta ativa</CardDescription>
        
      </CardHeader>
      <CardContent>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg md:text-xl ">
            {subscriptions.plan === "BASIC" ? "BASICO" : "PROFISSIONAL"}
            
          </h3>
          <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md">
            {subscriptions.status === "active" ? "Ativo" : "Inativo"}
          </div>
          </div>

          <ul className="list-disc ml-4 list-inside space-y-2">
            {subscriptionInfo && subscriptionInfo.features.map((feature, index) => (
              <li key={index} className="text-sm md:text-base">{feature}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleManageSubscription}
          >
            Gerenciar assinatura
          </Button>
        </CardFooter>
    </Card>
  )
}