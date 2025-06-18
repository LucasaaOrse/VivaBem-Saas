"use server"

import { Plan } from "@/generated/prisma"
import { PlansProps } from "../plans"

export interface PlanDetailInfo {
 maxServices: number 
}


const PLANS_LIMITS: PlansProps  = {
  BASIC: {
    maxServices: 5
  },
  PROFESSIONAL: {
    maxServices: 30
  },
  TRIAL: {
    maxServices: 3
  }
}

export async function getPlan(planId: Plan){
  return PLANS_LIMITS[planId]
}