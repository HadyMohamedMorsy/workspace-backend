export function convertTo24HourDate(hour: number, minute: number, period: string): Date {
  const currentDate = new Date();
  let hour24 = hour;

  if (period === "pm" && hour < 12) hour24 += 12;
  if (period === "am" && hour === 12) hour24 = 0;

  currentDate.setHours(hour24, minute, 0, 0);
  return currentDate;
}

export function calculateTimeDifferenceInHours(startDate: Date, endDate: Date) {
  const diffInMillis = endDate.getTime() - startDate.getTime();
  return Math.abs(Math.round(diffInMillis / (1000 * 60 * 60)));
}
