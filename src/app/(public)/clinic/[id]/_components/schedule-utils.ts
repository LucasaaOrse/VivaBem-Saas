

export function isToDay(date: Date){
  const now = new Date()
  return(
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  )
}

export function isSlotInThePast(slotTime: string){

  const [slotHour, slotMinutes] = slotTime.split(":").map(Number)

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinutes = now.getMinutes()

  if(slotHour < currentHour || (slotHour === currentHour && slotMinutes < currentMinutes) ){
    return true
  }

  return false
}

export function isSlotSequenceAvaliable(
  startSlot: string,
  requiredSlots: number,
  allSlots: string[],
  blockedSlots: string[],

){
  
  const startIndex = allSlots.indexOf(startSlot)

  if(startIndex === -1 || startIndex + requiredSlots > allSlots.length){
    return false
  }

  for(let i = startIndex; i < startIndex + requiredSlots; i++){
    const slotTime = allSlots[i]

    if(blockedSlots.includes(slotTime)){
      return false
    }
  }

  return true

}