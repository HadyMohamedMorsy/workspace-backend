import * as moment from "moment";
import { TimeOfDay } from "src/shared/enum/global-enum";
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

import { TypeOrder } from "src/shared/enum/global-enum";

export const getOrderItemTotalPrice = (item: any, key: string): number => {
  let quantity = 0;
  let accessKey = "";
  switch (key) {
    case TypeOrder.PAID:
    case TypeOrder.HOLD:
      quantity = item.quantity;
      accessKey = "selling_price";
      break;
    case TypeOrder.COST:
      quantity = item.quantity;
      accessKey = "purshase_price";
      break;
    case TypeOrder.FREE:
      quantity = 0;
      accessKey = "selling_price";
      break;
    default:
      quantity = item.quantity;
      accessKey = "selling_price";
      break;
  }
  return item.product[accessKey] * quantity;
};

export function convertTo24HourDate(hour: number, minute: number, period: string): Date {
  const currentDate = new Date();
  const hour24 = ato24h(hour, period);
  currentDate.setHours(hour24, minute, 0, 0);
  return currentDate;
}

export function createMoment(day: string, hour: number, minute: number, period: TimeOfDay) {
  const [d, m, y] = day.split("/");
  const adjustedHour = ato24h(hour, period);
  return moment(`${y}-${m}-${d} ${adjustedHour}:${minute}`, "YYYY-MM-DD HH:mm");
}

export function ato24h(hour: number, period: string): number {
  if (period?.toLowerCase() === "pm" && hour < 12) return hour + 12;
  if (period?.toLowerCase() === "am" && hour === 12) return 0;
  return hour;
}

export function calculateTimeDifferenceInHours(startDate: Date, endDate: Date) {
  const diffInMillis = endDate.getTime() - startDate.getTime();
  return Math.abs(Math.round(diffInMillis / (1000 * 60 * 60)));
}

export function formatDate(date: string): string {
  return moment(date).format("DD/MM/YYYY");
}

export function createCairoTime(dateStr: string, hour: number, minute: number, zone: string) {
  const [day, month, year] = dateStr.split("/");
  return moment.tz(`${year}-${month}-${day} ${hour}:${minute}`, "YYYY-MM-DD HH:mm", zone);
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

  // Check if end time should be on the next day
  // If start is PM and end is AM, or if start hour > end hour and both are same period
  const startHour24 = ato24h(details.start_hour, details.start_time);
  const endHour24 = ato24h(details.end_hour, details.end_time);

  if (
    (startHour24 >= 12 && endHour24 < 12) ||
    (startHour24 > endHour24 && details.start_time === details.end_time)
  ) {
    // End time should be on the next day
    end.setDate(end.getDate() + 1);
  }

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  return remainingMinutes >= 10 ? hours + 1 : hours;
}

export function calculateOfferDiscount(basePrice: number, offer: any): number {
  if (!offer) return 0;
  const typeDiscount = offer.type_discount;
  const discountAmount = offer.discount;
  return typeDiscount === "amount" ? discountAmount : basePrice * (discountAmount / 100);
}

export function getCurrentTime() {
  const now = new Date();
  const egyptTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Cairo" }));

  return {
    hours: egyptTime.getHours() % 12 || 12,
    minutes: egyptTime.getMinutes(),
    timeOfDay: egyptTime.getHours() >= 12 ? TimeOfDay.PM : TimeOfDay.AM,
  };
}
