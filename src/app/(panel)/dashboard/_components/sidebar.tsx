"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


import { Button } from "@/components/ui/button"
import { BanknoteIcon, CalendarCheck, ChevronLeft, ChevronRight, Folder, List, Settings, LogOut, FileText, Loader2 } from "lucide-react"
import { SidbarLinks } from "./sidebarlinks"
import { ResultPermissionProp } from "@/utils/permissions/canPermission"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface SidebarProps {
  children: React.ReactNode,
  permissions: ResultPermissionProp
}

export function SidebarDashboard({children, permissions}: SidebarProps ){

  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { update } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  function openUpgradeModal() {
  setShowModal(true)
}

  async function handlelognout(){
    await signOut()
    await update()
    router.replace("/")
  }

  const pathname = usePathname()

useEffect(() => {
  if (loading) {
    setLoading(false) // página nova carregada, então paramos o loading
  }
}, [pathname])

  return (
  <div className="flex min-h-screen w-full">

    <aside
      className={clsx(
        "flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
        {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true,
        }
      )}
    >
      <div className="mb-6 mt-4">
        {!isCollapsed && (
          <span className="text-3xl font-bold text-zinc-800 tracking-tight">
            Viva<span className="text-emerald-500">Bem</span>{" "}
          </span>
        )}
      </div>

      <Button
        className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end "
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {!isCollapsed ? (
          <ChevronLeft className="w-12 h-12 " />
        ) : (
          <ChevronRight className="w-12 h-12 " />
        )}
      </Button>

      {/* Conteúdo da Sidebar que cresce */}
      <div className="flex flex-col flex-1 overflow-y-auto">

        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            <SidbarLinks
              href="/dashboard"
              icon={<CalendarCheck className="w-6 h-6" />}
              pathname={pathname}
              isCollapsed={isCollapsed}
              label="Agendamento"
              onClick={() => setLoading(true)}
            />

            <SidbarLinks
              href="/dashboard/services"
              icon={<Folder className="w-6 h-6" />}
              pathname={pathname}
              isCollapsed={isCollapsed}
              label="Serviços"
              onClick={() => setLoading(true)}
            />

            {permissions.planId !== "TRIAL" ? (
              <SidbarLinks
                href="/dashboard/reports"
                icon={<FileText className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Relatórios"
                onClick={() => setLoading(true)}
              />
            ) : (
              <button
                onClick={openUpgradeModal}
                className={clsx(
                  "flex items-center gap-2 rounded px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors",
                  {
                    "justify-center w-full": isCollapsed,
                  }
                )}
                title="Plano Trial - Faça upgrade para acessar"
              >
                <FileText className="w-6 h-6" />
                {!isCollapsed && (
                  <span className="italic text-sm underline">
                    Relatórios (Plano pago)
                  </span>
                )}
              </button>
            )}

            <SidbarLinks
              href="/dashboard/perfil"
              icon={<Settings className="w-6 h-6" />}
              pathname={pathname}
              isCollapsed={isCollapsed}
              label="Perfil"
              onClick={() => setLoading(true)}
            />
            <SidbarLinks
              href="/dashboard/plans"
              icon={<BanknoteIcon className="w-6 h-6" />}
              pathname={pathname}
              isCollapsed={isCollapsed}
              label="Planos"
              onClick={() => setLoading(true)}
            />
          </nav>
        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-400 font-medium uppercase">
                Painel
              </span>

              <SidbarLinks
                href="/dashboard"
                icon={<CalendarCheck className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Agendamento"
                onClick={() => setLoading(true)}
              />

              <SidbarLinks
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Serviços"
                onClick={() => setLoading(true)}
              />

              {permissions.planId !== "TRIAL" ? (
              <SidbarLinks
                href="/dashboard/reports"
                icon={<FileText className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Relatórios"
                onClick={() => setLoading(true)}
              />
            ) : (
              <button
                onClick={openUpgradeModal}
                className={clsx(
                  "flex items-center gap-2 rounded px-3 py-2 text-gray-400 hover:text-yellow-600 transition-colors",
                  {
                    "justify-center w-full": isCollapsed,
                  }
                )}
                title="Disponível apenas para planos pagos"
              >
                <FileText className="w-6 h-6" />
                {!isCollapsed && (
                  <span className="italic text-sm">
                    Relatórios{" "}
                    <span className="ml-1 text-yellow-500 font-semibold">★</span>
                  </span>
                )}
              </button>
            )}

              <span className="text-sm text-gray-400 font-medium uppercase">
                Configurações
              </span>

              <SidbarLinks
                href="/dashboard/perfil"
                icon={<Settings className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Perfil"
                onClick={() => setLoading(true)}
              />
              <SidbarLinks
                href="/dashboard/plans"
                icon={<BanknoteIcon className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Planos"
                onClick={() => setLoading(true)}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Botão no rodapé da sidebar */}
      <div className="mt-auto pt-4">
        <Button
          variant="destructive"
          className={clsx("w-full justify-start", {
            "px-0 justify-center": isCollapsed, // Centraliza quando retraído
          })}
          onClick={() => {
            handlelognout()
            setLoading(true)}
          } 
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <p className="ml-2">Sair</p>}
        </Button>
      </div>
    </aside>

    <div
      className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed,
      })}
    >
      <header className="md:hidden flex items-center justify-between border-b px-4 md:px-6 h-14 z-10 sticky top-0 bg-white">
        <Sheet>
          <div className="flex items-center gap-4">
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setIsCollapsed(false)}
              >
                <List className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <h1 className="text-base md:text-lg font-semibold">Menu VivaBem</h1>
          </div>

          <SheetContent side="right" className="sm:max-w-xs text-black">
            <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>VivaBem</SheetTitle>
              <SheetDescription>Menu Admininstrativo</SheetDescription>
            </SheetHeader>

            <nav className="grid gap-2 text-base pt-5">
              <SidbarLinks
                href="/dashboard"
                icon={<CalendarCheck className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Agendamento"
                onClick={() => setLoading(true)}
                
              />

              <SidbarLinks
                href="/dashboard/services"
                icon={<Folder className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Serviços"
                onClick={() => setLoading(true)}
              />

              {permissions.planId !== "TRIAL" ? (
                <SidbarLinks
                  href="/dashboard/reports"
                  icon={<FileText className="w-6 h-6" />}
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  label="Relatórios"
                  onClick={() => setLoading(true)}
                />
              ) : (
                <button
                  onClick={openUpgradeModal}
                  className={clsx(
                    "flex items-center gap-2 rounded px-3 py-2 text-gray-400 hover:text-yellow-600 transition-colors",
                    {
                      "justify-center w-full": isCollapsed,
                    }
                  )}
                  title="Disponível apenas para planos pagos"
                >
                  <FileText className="w-6 h-6" />
                  {!isCollapsed && (
                    <span className="italic text-sm">
                      Relatórios{" "}
                      <span className="ml-1 text-yellow-500 font-semibold">★</span>
                    </span>
                  )}
                </button>
              )}
              

              <SidbarLinks
                href="/dashboard/perfil"
                icon={<Settings className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Perfil"
                onClick={() => setLoading(true)}
              />
              <SidbarLinks
                href="/dashboard/plans"
                icon={<BanknoteIcon className="w-6 h-6" />}
                pathname={pathname}
                isCollapsed={isCollapsed}
                label="Planos"
                onClick={() => setLoading(true)}
              />
            </nav>
            <div className="mt-auto pt-4 mb-6">
              <Button variant="destructive" className="w-full justify-start" onClick={() => {
            handlelognout()
            setLoading(true)}
          } >
                <LogOut className="w-5 h-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex-1 relative py-4 px-2 md:p-6">
      {/* Loading apenas sobre o conteúdo */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 z-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}

      <main>{children}</main>
    </div>
    </div>
    <Dialog open={showModal} onOpenChange={setShowModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Funcionalidade exclusiva</DialogTitle>
      <DialogDescription className="text-zinc-600">
        O acesso aos relatórios é uma funcionalidade disponível apenas para
        clientes com um plano ativo.
        <br />
        Faça o upgrade para desbloquear estatísticas detalhadas e acompanhar o desempenho do seu consultório!
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setShowModal(false)}>
        Agora não
      </Button>
      <Button
        onClick={() => {
          setShowModal(false)
          router.push("/dashboard/plans")
        }}
        variant="default"
      >
        Ver planos disponíveis
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    
  </div>
);
}