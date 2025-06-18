"use client"

import { Button } from "@/components/ui/button"
import { TimeSlots } from "./schedule-content"
import { cn } from "@/lib/utils"
import { isSlotInThePast, isToDay, isSlotSequenceAvaliable } from "./schedule-utils"

interface ScheduleListProps {
  selectedDate: Date,
  selectedTime: string,
  requiredSlots: number
  blockedTimes: string[],
  availableTimesSlots: TimeSlots[], 
  clinicTimes:  string[]
  onSelectedTime: (time: string) => void
}

export function ScheduleTimeList({selectedDate, selectedTime, requiredSlots, blockedTimes, availableTimesSlots, clinicTimes, onSelectedTime}: ScheduleListProps) {

  const dateIsToday = isToDay(selectedDate)



  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
      {availableTimesSlots.map((slot) => {

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time)

        const sequenceOK = isSlotSequenceAvaliable(slot.time, requiredSlots, clinicTimes, blockedTimes)

        const slotEnable = slot.avalible && sequenceOK && !slotIsPast


        return (
          <Button
            onClick={() => slotEnable && onSelectedTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            className={cn("h-10 select-none", 
              selectedTime === slot.time && "border-emerald-500 text-primary",
              !slotEnable && "text-muted-foreground cursor-not-allowed opacity-50",
            )}
            disabled={!slotEnable}
          >
            {slot.time}
          </Button>
        )
      })}
    </div>
  )

}


