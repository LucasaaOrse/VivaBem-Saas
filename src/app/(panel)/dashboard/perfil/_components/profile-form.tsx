import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface UserProfileProps {
  name: string | null;
      address: string | null;
      phone: string | null;
      status: boolean;
      timeZone: string | null
}

const profileSchema = z.object({
  name: z.string().min(1, {message: "O nome é obrigatorio"}),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(1, {message: "O horario é obrigario"})

})
 
export type ProfileFormData = z.infer<typeof profileSchema>

export function useProfileForm({ name, address, phone, status, timeZone } : UserProfileProps){
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues:{
      name: name || "",
      address: address || "",
      phone: phone || "",
      status: status ? "active" : "inactive",
      timeZone: timeZone || ""
    }
  })
}


