export function toIsoDate(date: string): string {
  const [day, month, year] = date.split(".");
  return year && month && day ? `${year}-${month}-${day}` : date;
}

export function toIsoDateTime(date: string, time: string): string {
  return `${toIsoDate(date)}T${time}:00+03:00`;
}
