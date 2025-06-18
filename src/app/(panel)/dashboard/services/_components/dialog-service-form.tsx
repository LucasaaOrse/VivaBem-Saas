import { z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  name: z.string().min(1, {message: "O nome do serviço é obrigatorio"}),
  price: z.string().min(1, {message: "O preco do serviço é obrigatorio"}),
  hours: z.string(),
  minutes: z.string()
})

export interface UseDialogServiceFormProps{
  initalValues?: {
    name: string,
    price: string,
    hours: string,
    minutes: string
  }

}

export type DialogServiceFormSchema = z.infer<typeof formSchema>

export function useDialogServiceForm({initalValues} : UseDialogServiceFormProps) {
  return useForm<DialogServiceFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initalValues || {
      name: "",
      price: "",
      hours: "",
      minutes: ""
    }
  })
}
