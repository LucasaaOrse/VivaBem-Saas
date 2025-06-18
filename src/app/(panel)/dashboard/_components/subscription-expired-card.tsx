"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SubscriptionExpiredCardProps {
  title?: string
  description?: string
  buttonText?: string
  redirectTo?: string
}

export function SubscriptionExpiredCard({
  title = "Período de teste encerrado",
  description = "Sua conta estava em modo de avaliação gratuita, que já expirou.",
  buttonText = "Ver Planos",
  redirectTo = "/planos",
}: SubscriptionExpiredCardProps) {
  const router = useRouter()

  return (
    <Card className="max-w-xl mx-auto text-center p-6">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Para continuar utilizando o sistema, selecione um dos nossos planos.</p>
        <Button>
          <Link href={redirectTo}>
          {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
