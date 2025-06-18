"use client"

import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LogIn, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


export function Header(){

  const {data: session, status} = useSession()

  const navItems = [
    {href: "#Profissionais", label: "Profissionais"},
    {href: "#contatos", label: "Contatos"}
  ]

  const router = useRouter()
async function handleLoginRedirect(){
  router.push("/login")
}

  const NavLinks = () => (
    <>
      {navItems.map((items) => (
        <Button
          key={items.href}
          asChild
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link
            href={items.href}
            className="text-base"
          >
            {items.label}
          </Link>
          
        </Button>
      ))}

    {status === "loading" ? (
      <></>
    ) : session ? (
      <Button
        asChild
        variant="default"
        className="flex items-center justify-center gap-2 bg-black text-white rounded-full px-5 py-2 hover:bg-zinc-800 transition"
      >
        <Link href="/dashboard">
          {/* Você pode colocar um ícone aqui se quiser */}
          Acessar clínica
        </Link>
      </Button>
    ) : (
      <Button onClick={handleLoginRedirect} className="flex items-center gap-2">
        <LogIn />
        Portal da clínica
      </Button>
    )}
    </>
  )



  return(
    <header 
      className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 ba bg-white"
    >

      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link 
          href="/"
          className="text-3xl font-bold text-zinc-800"
          >
          
          Viva<span className="text-emerald-400">Bem</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks/>
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              className="text-black hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[240px] sm:w-[300px] z-[9999] flex flex-col gap-2">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navegue pelas opções
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col space-y-4 mt-6">
              <NavLinks/>
            </nav>
          </SheetContent>
        </Sheet>

      </div>

    </header>
  )
}