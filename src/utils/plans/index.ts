
export type PlanDetailsProps = {
  maxServices: number
}

export type PlansProps = {
  BASIC: PlanDetailsProps,
  PROFESSIONAL: PlanDetailsProps
  TRIAL: PlanDetailsProps
}


export const PLANS: PlansProps  = {
  TRIAL: {
    maxServices: 2
  },

  BASIC: {
    maxServices: 5
  },
  PROFESSIONAL: {
    maxServices: 30
  }
}

export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Basico",
    description: "Plano perfeito para clinicas menores",
    oldPrice: "R$ 134,90",
    price: 'R$ 49,90',
    features: [
      `Até ${PLANS['BASIC'].maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte",
      "Relatorios basicos"
    ]
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Plano perfeito para clinicas maiores",
    oldPrice: "R$ 197,90",
    price: 'R$ 97,90',
    features: [
      `Até ${PLANS['PROFESSIONAL'].maxServices} serviços`,
      "Agendamentos ilimitados",
      "Suporte prioritario",
      "Relatorios avançados"
    ]
  }
]