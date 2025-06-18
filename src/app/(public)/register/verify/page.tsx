// app/register/verify/page.tsx
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function EmailVerificationNotice() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")

  if (!email) {
  router.replace("/")
  return null
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-6 text-center">
        <CheckCircle className="text-emerald-500 w-12 h-12 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">
          Quase lá! Falta só um passo...
        </h2>
        <p className="text-gray-600 text-sm">
          Enviamos um link de confirmação para o e-mail:
        </p>
        <p className="font-medium text-gray-800">{email}</p>
        <p className="text-sm text-gray-500">
          Clique no link enviado para ativar sua conta.
        </p>
        <Button onClick={() => router.push("/login")}>
          Voltar para o login
        </Button>
      </div>
    </div>
  )
}
