import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Img1 from "../../../../public/images (4).jpg"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Img2 from "../../../../public/images (5).jpg"
import Img3 from "../../../../public/images (6).jpg"
import Img4 from "../../../../public/images (7).png"
import { User } from "@/generated/prisma"

interface ProfessionalsProps {
  professionals: User[]
}

export function Professionals({professionals}: ProfessionalsProps){
  return(
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl text-center mb-12 font-bold"
        >
          Clinicas cadastradas</h2>
      </div>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {professionals.map((clinic) => (
          <Card className="overflow-hidden hover:shadow-lg duration-300" key={clinic.id}>
          <CardContent className="">
            <div>
              <div className="relative h-48">
                <Image
                  src={ clinic.image || Img1}
                  alt="Clinica 1"
                  fill
                  className="object-cover"
                  quality={100}
                
                />
              </div>
            </div>

            <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
              <div className="flex items-center justify-between"> 
                <div>
                  <h3 className="font-semibold">{clinic.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{clinic.address || "Endereço não informado"}</p>
                </div>
              </div>

              <Link 
                href={`/clinic/${clinic.id}`}
                target="_blank"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                >
                Agendar horario

                <ArrowRight className="ml-2"/>
              </Link>

            </div>
          </CardContent>
        </Card>
        ))}

      </section>


    </section>
  )
}