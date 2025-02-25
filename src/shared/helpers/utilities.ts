import * as moment from "moment";

export interface calulateHour {
  start_hour: number;
  start_minute: number;
  start_time: string;
  end_hour: number;
  end_minute: number;
  end_time: string;
}

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

export function formatDate(date: string): string {
  return moment(date).format("DD/MM/YYYY");
}

export function calculateHours(details: calulateHour) {
  const start = convertTo24HourDate(details.start_hour, details.start_minute, details.start_time);
  const end = convertTo24HourDate(details.end_hour, details.end_minute, details.end_time);
  return Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
}
