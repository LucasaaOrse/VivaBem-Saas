"use client"

import { Reminder } from "@/generated/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteReminder } from "../../_actions/delete-reminder"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ReminderContent } from "./reminder-content"
import { useState, useTransition } from "react"

interface ReminderListProps {
  reminders: Reminder[]
}

export function RemindersList({ reminders }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDeleteReminder(id: string) {
    startTransition(async () => {
      const response = await deleteReminder({ reminderId: id })

      if (response?.error) {
        toast.error(response.error)
        return
      }

      toast.success("Lembrete deletado com sucesso")
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl">Lembretes</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-9 p-0">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo lembrete</DialogTitle>
                <DialogDescription>Adicione um novo lembrete</DialogDescription>
              </DialogHeader>
              <ReminderContent closeDialog={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum lembrete cadastrado</p>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
              {reminders.map((reminder) => (
                <article
                  key={reminder.id}
                  className="flex items-center justify-between py-2 px-3 border rounded-md bg-yellow-50 hover:bg-yellow-100 transition"
                >
                  <p className="text-sm lg:text-base">{reminder.description}</p>
                  <Button
                    size="icon"
                    className="bg-red-500 hover:bg-red-600 shadow-none"
                    disabled={isPending}
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash className="w-4 h-4 text-white" />
                  </Button>
                </article>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
