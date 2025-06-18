
import { getReminders } from "../../_data-access/get-reminders"
import { RemindersList } from "./reminder-list"

export async function Reminders({userId}: {userId: string}) {

  const reminders = await getReminders({userId: userId})

  return (
    <RemindersList reminders={reminders}/>
  )
}