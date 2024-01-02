export function roundedNumber(number) {
  const roundednumber = Math.round(number)
  return roundednumber
}

export function formatTime(time) {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${hours}:${formattedMinutes}`
}
