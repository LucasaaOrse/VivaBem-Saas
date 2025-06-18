"use client"

import { z } from 'zod';
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "./_components/registerSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ArrowLeft } from "lucide-react"
import { formatPhone } from "@/utils/formatPhone"
import { useRegisterFormData } from "./_components/registerSchema"

type RegisterFormData = z.infer<typeof registerSchema>
export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const form = useForm<RegisterFormData>({
  resolver: zodResolver(registerSchema),
  mode: "onBlur",
})

const { watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = form

  // para formatar telefone enquanto digita
  const phoneValue = watch("phone") || ""


  function onPhoneChange(value: string) {
    const formatted = formatPhone(value)
    setValue("phone", formatted)
  }

  async function onSubmit(data: RegisterFormData) {
  setError("")
  console.log("Função onSubmit foi chamada com:", data)

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    console.log("Status da resposta:", res.status)
    console.log("Resposta JSON:", json)

    if (!res.ok) {
      setError(json.error || "Erro ao criar conta.")
    } else {
      router.push(`/register/verify?email=${encodeURIComponent(data.email)}`)
    }
  } catch (err) {
    console.error("Erro no fetch:", err)
    setError("Erro ao criar conta. Verifique sua conexão ou tente novamente.")
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Botão voltar no topo esquerdo */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-200 transition"
        aria-label="Voltar para home"
        type="button"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Criar Conta</h1>
        <p className="text-sm text-center text-gray-500 mb-4">
          Preencha seus dados para cadastrar sua clínica
        </p>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Clínica</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da clínica"  />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@clinica.com" />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Senha" />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Rua, número, bairro"/>
                  </FormControl>
                  <FormMessage>{errors.address?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="(99) 99999-9999"
                      maxLength={15}
                      onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage>{errors.phone?.message}</FormMessage>
                </FormItem>
              )}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar conta"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Entrar
          </a>
        </div>
      </div>
    </div>
  )
}
