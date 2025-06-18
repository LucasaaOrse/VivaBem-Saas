"use client"

import Image from "next/image"
import { ChangeEvent, useState } from "react"
import NoneImage from "../../../../../../public/Doctor_hero.webp"
import { Loader, Upload } from "lucide-react"
import { toast } from "sonner"
import { updateProfileAvatar } from "../_actions/update-avatar"
import { useSession } from "next-auth/react"

interface AvatarProfileProps{
  avatarUrl: string | null
  userId: string
}

export function AvatarProfile({ avatarUrl, userId } : AvatarProfileProps){

  const [previewImage, setPreviewImage] = useState(avatarUrl)
  const [loading, setLoading] = useState(false)

  const { update } = useSession()

  async function handleChange(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      setLoading(true)
      const image = e.target.files[0];

      if(image.type !== "image/jpeg" && image.type !== "image/png" && image.type !== "image/jpg"){
        toast.error("Formato de imagem inválido")
        return
      }

      const newName = `${userId}`
      const newFile = new File([image], newName, {type: image.type})

      const urlImage = await uploadImage(newFile)

      if(!urlImage || urlImage === ""){
        toast.error("Erro ao alterar imagem")
        return
      }
      setPreviewImage(urlImage)

      await updateProfileAvatar({avatarUrl: urlImage})
      await update({
        image: urlImage
      })
      
      setLoading(false)

  }
}
  
  async function uploadImage(image: File): Promise<string | null> {
    
    try {

      toast.success("Enviado sua imagem")

      const formData = new FormData()
      formData.append("file", image)
      formData.append('userId', userId)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/image/upload`, {
        method: "POST",
        body: formData
      })
      
      if(!response.ok){
        return null
      }

      const data = await response.json()

      toast.success("Imagem enviada com sucesso")
      return data.secure_url as string

    } catch (error) {
      console.log(error)
      return null
    }

  }

  return(
    <div className="relative w-40 h-40 md:w-48 md:h-48">

      <div className="relative flex items-center justify-center w-full h-full">
        <span className="absolute cursor-pointer z-[2] bg-slate-50 p-2 rounded-full shadow-xl">
          {loading ? (
            <Loader size={16} color="#131313" className="animate-spin"/>
          ): (
            <Upload size={16} color="#131313" />
          )}
        </span>
        <input 
          type="file" 
          className="cursor-pointer relative z-50 w-48 h-48 opacity-0" 
          onChange={handleChange} 
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto de perfil"
          fill
          className="w-full h-40 rounded-full object-cover bg-slate-200"
          priority
          quality={100}
          sizes="(max-width: 480px) 100vw, (max-width: 1224px) 75vw, 60vw"
        />
      ): (
        <Image
          src={NoneImage}
          alt="Foto de perfil"
          fill
          className="w-full h-40 rounded-full object-cover bg-slate-200"
          priority
          quality={100}
          sizes="(max-width: 480px) 100vw, (max-width: 1224px) 75vw, 60vw"
        />
      )}
    </div>
  )
}