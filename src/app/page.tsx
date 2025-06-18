import { Footer } from "./(public)/_components/footer";
import { Header } from "./(public)/_components/header";
import { Hero } from "./(public)/_components/hero";
import { Professionals } from "./(public)/_components/professionals";
import { getProfessionals } from "./(public)/_data-access/get-professionals";

export const revalidate = 120;

export default async function Home() {

  const professionals = await getProfessionals()

  

  return (
    <div className="flex flex-col min-h-screen">
     <Header/>

      <div>
        <Hero/>

        <Professionals professionals={professionals}/>

        <Footer/>
      </div>

    </div>
  );
}
