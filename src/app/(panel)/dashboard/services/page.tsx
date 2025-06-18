
import  getSession  from "@/lib/getSession"
import { redirect } from "next/navigation"
import { ServicesContent } from "./_components/servicess-content"
export default async function Services(){
  const session = await getSession()

  if(!session){
    redirect('/')
  }
  
  return (
    <div>
      <ServicesContent userId={session.user?.id!} />
    </div>
  )
}