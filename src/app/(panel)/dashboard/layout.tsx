import { canPermission } from "@/utils/permissions/canPermission"
import { SidebarDashboard } from "./_components/sidebar"


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}){
  const permissions = await canPermission({type: "service"})

  return (
    <>
      <SidebarDashboard permissions={permissions}>
        {children}
      </SidebarDashboard>
      
    </>
  )
}