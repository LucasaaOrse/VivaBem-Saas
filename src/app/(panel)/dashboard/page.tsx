
import { redirect } from "next/navigation"
import getSession from "../../../lib/getSession"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { ButtonCopyLink } from "./_components/button-copy-link"
import { Reminders } from "./_components/reminder/reminders"
import { Appointments } from "./_components/appointments/appointments"
import { canPermission } from "@/utils/permissions/canPermission"
import { TrialBanner } from "./_components/TrialBanner"



export default async function Dashboard(){
  const session = await getSession()
  
  console.log(session)

  if(!session){
    redirect('/')
  }

  const permissions = await canPermission({type: "service"})

  return (
    <main>
      <div className="space-x-2 items-center justify-end flex">
        <Link href={`/clinic/${session.user?.id}`}
          target="_blank"
          
        >
          <Button className="bg-emerald-500 hoverbg-emerald-400 flex-1 md:flex-[0]" >
            <Calendar className="w-5 h-5" />
            Agendar consulta 
          </Button>
        
        </Link>

        <ButtonCopyLink userId={session.user?.id!} />

      </div>

      {permissions.planId === "TRIAL" && !permissions.expired && (
        <TrialBanner permissions={permissions} />
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Appointments userId={session.user?.id!}/>
        <Reminders userId={session.user?.id!}/>
      </section>


    </main>
  )
}