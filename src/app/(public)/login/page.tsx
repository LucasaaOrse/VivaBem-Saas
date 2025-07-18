"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import GitHub from "../../../../public/github.svg"
import Google from "../../../../public/google.svg"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      const errorMessage =
        res.error === "CredentialsSignin"
          ? "Email ou senha inválidos. Verifique seus dados."
          : res.error
      setError(errorMessage)
      setLoading(false)
    } else {
      router.push("/dashboard")
    }
  }

  async function handleProviderLogin(provider: "google" | "github") {
    await signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200 transition"
        aria-label="Voltar para home"
        type="button"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Bem-vindo de volta</h1>
        <p className="text-center text-sm text-gray-500">Faça login para acessar sua conta</p>

        {success === "verify-email" && (
          <p className="text-green-600 text-sm text-center bg-green-100 border border-green-300 px-4 py-2 rounded-md">
            Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.
          </p>
        )}

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-100 border border-red-300 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </a>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">ou entre com</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-center flex items-center gap-2"
            onClick={() => handleProviderLogin("google")}
          >
            <Image src={Google} alt="Google" width={20} height={20} />
            Entrar com Google
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center flex items-center gap-2"
            onClick={() => handleProviderLogin("github")}
          >
            <Image src={GitHub} alt="GitHub" width={20} height={20} />
            Entrar com GitHub
          </Button>
        </div>
      </div>
    </main>
  )
}
