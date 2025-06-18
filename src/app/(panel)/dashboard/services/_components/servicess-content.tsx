import Link from "next/link"
import getAllServices from "../_data-access/get-all-services"
import { ServicesList } from "./services-list"
import { canPermission } from "@/utils/permissions/canPermission"


interface ServicesContentProps {
  userId: string
}
export async function ServicesContent({userId}: ServicesContentProps) {

  const services = await getAllServices({userId: userId})
  const permissions = await canPermission({type: "service"})

  console.log(permissions)

  return (
    <ServicesList services={services.data || []} permissions={permissions}/>
  )
}
