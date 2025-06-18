import { Button } from "@/components/ui/button";
import Image from "next/image";
import ImgDoctor from "../../../../public/Doctor_hero.webp"

export function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8 pb-4 sm:pb-0">
        <main className="flex items-center justify-center">
          <article className="flex-[2] space-y-8 max-w-3xl flex flex-col justify-center ">
            <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
              Encontre os melhores proficionais em um único lugar
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Gestão simples, agenda inteligente e prontuário digital. 
              A solução completa para consultórios que querem ganhar tempo e crescer.
            </p>

            <Button className="bg-emerald-500 hover:bg-emerald-600 w-fit px-6 font-semibold">
              Encontre uma clinica
            </Button>
          </article>

          <div className="hidden lg:block">
            <Image
              src={ImgDoctor}
              alt="Doctor image"
              width={340}
              height={400}
              className="object-contain"
              quality={100}
              priority

            />

          </div>

        </main>
      </div>
    </section>
  )
}