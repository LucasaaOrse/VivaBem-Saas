import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  address: z.string().optional(),
  phone: z.string()
    .optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export function useRegisterFormData() {
  return useForm<RegisterFormData>({ 
    resolver: zodResolver(registerSchema),
    defaultValues:{
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    }
   })
    
}