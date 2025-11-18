export function minutesBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 60000)
}

export function topOffsetForTime(d: Date, dayStartHour = 0, pxPerMinute = 0.8) {
  const mins = d.getHours() * 60 + d.getMinutes() - (dayStartHour * 60)
  return mins * pxPerMinute
}
