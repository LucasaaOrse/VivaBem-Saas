
import { redirect } from "next/navigation"
import { getScheduleInfo } from "./_data-acess/get-schedule-info"
import { ScheduleContent } from "./_components/schedule-content"

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}){

  const userId = (await params).id
  const user = await getScheduleInfo({userId: userId})

  if(!user){
    redirect("/")
  }

  return(
    <ScheduleContent clinic={user}/>
  )

}