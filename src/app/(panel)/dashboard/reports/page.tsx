import { redirect } from "next/navigation";
import ClinicStats from "./components/clinic-status";
import getSession from "@/lib/getSession";
import { canPermission } from "@/utils/permissions/canPermission";


export default async function Reports() {

  const session = await getSession()
  const permissions = await canPermission({type: "service"})

  if(!session){
    redirect('/')
  }


  return (
    <ClinicStats userId={session.user?.id} permissions={permissions}/>
  )
}