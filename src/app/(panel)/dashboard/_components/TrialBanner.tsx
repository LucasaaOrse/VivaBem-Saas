"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"
import { differenceInDays, addDays, format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TrialBannerProps {
  permissions: ResultPermissionProp
}

export function TrialBanner({ permissions }: TrialBannerProps) {
  // Só exibe se estiver no plano TRIAL e o trial ainda não tiver expirado
  if (permissions.planId !== "TRIAL" || permissions.expired) return null

  const trialDays = 7
  const createdAt = permissions.createdAt ? new Date(permissions.createdAt) : null
  const trialEndsAt = createdAt ? addDays(createdAt, trialDays) : null
  const daysRemaining = trialEndsAt ? differenceInDays(trialEndsAt, new Date()) : 0


  return (
    <Alert className="rounded-none border-0 border-b bg-yellow-100 text-yellow-900">
      <Info className="h-4 w-4" />
      <AlertTitle>Você está no período de teste</AlertTitle>
      <AlertDescription>
        <p>
          Aproveite todos os recursos gratuitamente durante o período de avaliação.
        </p>
        {trialEndsAt && (
          <p>
            Seu teste expira em <strong>{daysRemaining} {daysRemaining === 1 ? "dia" : "dias"}</strong>, no dia{" "}
            <strong>{format(trialEndsAt, "dd 'de' MMMM", { locale: ptBR })}</strong>.
          </p>
        )}
      </AlertDescription>
    </Alert>
  )
}
