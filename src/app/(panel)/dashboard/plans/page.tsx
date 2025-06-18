import  getSession  from "@/lib/getSession"
import { redirect } from "next/navigation"
import { GridPlans } from "./_components/grid-plans"
import { getSubscription } from "@/utils/get-subscription"
import { SubscriptionsDetail } from "./_components/subscriptions-detail"

export default async function Plans(){

  const session = await getSession()

  if(!session){
    redirect('/')
  }

  const subscription = await getSubscription({userId: session.user?.id!})

  return (
    <div>
      {subscription?.status !== "active" && (
        <GridPlans />
      )}

      {subscription?.status === "active" && (
        <SubscriptionsDetail subscriptions={subscription!}/>
      )}
    </div>
  )
}