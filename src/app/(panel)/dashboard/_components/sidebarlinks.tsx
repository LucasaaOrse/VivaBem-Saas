import clsx from "clsx";
import Link from "next/link";

interface SidebarLinkProps{
  href: string
  icon: React.ReactNode
  pathname: string
  label: string
  isCollapsed: boolean
  onClick?: () => void
}

export function SidbarLinks({href, icon, isCollapsed, label, pathname, onClick}: SidebarLinkProps){
  return (
    <Link
      href={href}
      onClick={onClick}
    >
      <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
        "bg-blue-500 text-white" : pathname === href,
        "text-gray-700 hover:bg-gray-100" : pathname !== href,
      })}>
        <span className="w-6 h-6" >{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>

    </Link>
  )
}