"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useReminderForm, ReminderFormData } from "./reminder-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { createReminder } from "../../_actions/create-reminder"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ReminderContentProps {
  closeDialog: () => void 
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
  const form = useReminderForm()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: ReminderFormData) {
    setIsLoading(true)
    const response = await createReminder({ description: formData.description })

    if (response.error) {
      toast.error(response.error)
      setIsLoading(false)
      return
    }

    toast.success("Lembrete criado com sucesso")
    setIsLoading(false)
    closeDialog()
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold">Lembrete:</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite seu lembrete..."
                    {...field}
                    className="max-h-52"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || !form.watch("description")}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>Salvar lembrete</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
