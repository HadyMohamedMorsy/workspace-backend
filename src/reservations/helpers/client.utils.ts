import { calculateHours, getCurrentTime } from "src/reservations/helpers/utitlties";

export interface TimeData {
  hours: number;
  minutes: number;
  timeOfDay: string;
}

export interface TimeFields {
  start_time: string;
  start_hour: number;
  start_minute: number;
  end_time: string;
  end_hour: number;
  end_minute: number;
}

export interface Offer {
  id: string;
  type: "PERCENTAGE" | "AMOUNT";
  value: number;
}

export const calculateTotalTime = (
  startHour: number,
  startMinute: number,
  startTime: string,
  endHour: number,
  endMinute: number,
  endTime: string,
  isFullDay: boolean,
): number => {
  if (isFullDay) return 24;
  return calculateHours({
    start_hour: startHour,
    start_minute: startMinute,
    start_time: startTime,
    end_hour: endHour,
    end_minute: endMinute,
    end_time: endTime,
  });
};

export const getPricePerHour = (type: string, settings: any): number => {
  return type === "shared" ? settings.price_shared : settings.price_deskarea;
};

export const getFullDayPrice = (type: string, settings: any): number => {
  return type === "shared" ? settings.full_day_price_shared : settings.full_day_price_deskarea;
};

export const calculateDiscount = (price: number, offer?: Offer): number => {
  if (!offer) return 0;

  if (offer.type === "PERCENTAGE") {
    return (price * offer.value) / 100;
  }

  return offer.value;
};

export const calculatePrice = (data: any, totalTime: number, settings: any): number => {
  const basePrice = data.is_full_day
    ? getFullDayPrice(data.type, settings)
    : getPricePerHour(data.type, settings) * totalTime;

  const discount = calculateDiscount(basePrice, data.offer);
  return basePrice - discount;
};

export const formatTimeFields = (data: any, createTime: TimeData): TimeFields => {
  return {
    start_time: data.start_time,
    start_hour: data.start_hour,
    start_minute: data.start_minute,
    end_time: data.end_time || createTime.timeOfDay,
    end_hour: data.end_hour || createTime.hours,
    end_minute: data.end_minute || createTime.minutes,
  };
};

export const formatTimeData = (data: any, settings: any) => {
  const createTime = getCurrentTime();
  const timeFields = formatTimeFields(data, createTime);
  const totalTime = calculateTotalTime(
    timeFields.start_hour,
    timeFields.start_minute,
    timeFields.start_time,
    timeFields.end_hour,
    timeFields.end_minute,
    timeFields.end_time,
    data.is_full_day,
  );

  const basePrice = data.is_full_day
    ? getFullDayPrice(data.type, settings)
    : getPricePerHour(data.type, settings) * totalTime;

  const discount = calculateDiscount(basePrice, data.offer);
  const finalPrice = basePrice - discount;

  return {
    id: data.id,
    ...timeFields,
    total_price: finalPrice,
    original_price: basePrice,
    discount_amount: discount,
    total_time: totalTime,
    is_full_day: data.is_full_day,
    selected_day: data.selected_day,
    offer: data.offer
      ? {
          id: data.offer.id,
          type: data.offer.type,
          value: data.offer.value,
          discount_amount: discount,
        }
      : null,
  };
};

export const formatOrderData = (order: any) => {
  return {
    id: order.id,
    order_number: order.order_number,
    order_price: order.order_price,
    total_order: order.total_order,
  };
};

export const formatRoomData = (room: any, settings: any) => {
  return {
    ...formatTimeData(room, settings),
    is_full_day: false,
  };
};

export const formatOfferData = (item: any) => {
  if (!item?.assignGeneralOffer?.generalOffer) return null;

  const { generalOffer } = item.assignGeneralOffer;
  return {
    id: generalOffer.id,
    type: generalOffer.type_discount,
    value: generalOffer.discount,
  };
};
