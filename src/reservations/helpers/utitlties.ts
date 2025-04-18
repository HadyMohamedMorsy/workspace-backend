import * as moment from "moment";
import { UpdateDeskAreaDto } from "../deskarea/dto/update-deskarea.dto";
import { UpdateSharedDto } from "../shared/dto/update-shared.dto";

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

export function diffrentHour(rest: Partial<UpdateDeskAreaDto | UpdateSharedDto>) {
  return calculateHours({
    start_hour: rest.start_hour,
    start_minute: rest.start_minute,
    start_time: rest.start_time,
    end_hour: rest.end_hour,
    end_minute: rest.end_minute,
    end_time: rest.end_time,
  });
}

export function calculateHours(details: calulateHour) {
  const start = convertTo24HourDate(details.start_hour, details.start_minute, details.start_time);
  const end = convertTo24HourDate(details.end_hour, details.end_minute, details.end_time);

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return remainingMinutes > 10 ? hours + 1 : hours;
}
