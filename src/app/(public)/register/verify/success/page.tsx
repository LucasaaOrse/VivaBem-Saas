"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifySuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login") // substitui rota ao invés de empurrar para histórico
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-6 text-center">
        <CheckCircle className="text-emerald-500 w-12 h-12 mx-auto" />
        <h1 className="text-2xl font-bold text-green-600">E-mail verificado com sucesso!</h1>
        <p className="mt-2 text-gray-600">
          Agora você pode fazer login com sua conta.
        </p>
        <p className="text-sm text-gray-500">
          Você será redirecionado automaticamente para a página de login.
        </p>
        <Button onClick={() => router.push("/login")}>
          Ir para login agora
        </Button>
      </div>
    </div>
  )
}
