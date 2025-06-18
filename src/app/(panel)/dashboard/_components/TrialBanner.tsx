"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"

interface TrialBannerProps {
  permissions: ResultPermissionProp
}

export function TrialBanner({ permissions }: TrialBannerProps) {
  // Só exibe se estiver no plano TRIAL e o trial ainda não tiver expirado
  if (permissions.planId !== "TRIAL" || permissions.expired) return null

  return (
    <Alert className="rounded-none border-0 border-b bg-yellow-100 text-yellow-900">
      <Info className="h-4 w-4" />
      <AlertTitle>Você está no período de teste</AlertTitle>
      <AlertDescription>
        Aproveite todos os recursos gratuitamente durante o período de avaliação.
        Escolha um plano antes que ele expire para não perder o acesso.
      </AlertDescription>
    </Alert>
  )
}
