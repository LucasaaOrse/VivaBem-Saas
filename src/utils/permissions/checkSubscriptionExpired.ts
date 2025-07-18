"use server"

import { Session } from "next-auth";
import { addDays, isAfter } from "date-fns";
import { ResultPermissionProp } from "./canPermission";
import { PLANS } from "../plans";

const trialDays = 7

export async function checkSubscriptionExpired(session: Session): Promise<ResultPermissionProp> {

  const createdAt = new Date(session.user.createdAt)
  
  const trialEndDate = addDays(createdAt, trialDays)

  if(isAfter(new Date(), trialEndDate)) {
    return {
      hasPermission: false,
      planId: "TRIAL",
      expired: true,
      plan: null,
      createdAt: createdAt.toISOString(),
    }
  }
  return {
    hasPermission: true,
    planId: "TRIAL",
    expired: false,
    plan: PLANS.TRIAL,
    createdAt: createdAt.toISOString()
  }
}