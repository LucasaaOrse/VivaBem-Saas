import { object, string } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email é obrigatorio" })
    .min(1, "Email é obrigatorio")
    .email("Email inválido"),
  password: string({ required_error: "Senha é obrigatoria" })
    .min(1, "Senha é obrigatoria")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(32, "Senha deve ter menos de 32 caracteres"),
})