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

export const calculateDiscount = (price: number, offer?: Offer): number => {
  if (!offer) return 0;

  if (offer.type === "PERCENTAGE") {
    return (price * offer.value) / 100;
  }

  return offer.value;
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

export const formatTimeData = (data: any, price?: any) => {
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

  const basePrice = data.is_full_day ? price : price * totalTime;
  const discount = calculateDiscount(basePrice, data.offer);
  const finalPrice = basePrice - discount;

  return {
    id: data.id,
    ...timeFields,
    total_price: finalPrice,
    original_price: price,
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

export const formatRoomData = (room: any, price: number) => {
  return {
    ...formatTimeData(room, price),
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

export function getPriceCoWorkingSpace(item: any, type: string, settings: any): number {
  const isShared = type === "shared";

  const priceKey = isShared
    ? item.is_full_day
      ? "full_day_price_shared"
      : "price_shared"
    : item.is_full_day
      ? "full_day_price_deskarea"
      : "price_deskarea";

  return +settings[priceKey];
}

export function formatItem(
  item: any,
  type: string,
  settings: any,
  hasMembership: boolean,
  membershipType: string,
) {
  const data = formatTimeData(
    { ...item, type, offer: formatOfferData(item) },
    getPriceCoWorkingSpace(item, type, settings),
  );
  const isMembershipType = membershipType === type;
  return {
    ...data,
    total_price: hasMembership && isMembershipType ? 0 : +data.total_price,
    original_price: hasMembership && isMembershipType ? 0 : +data.original_price,
    is_membership: hasMembership && isMembershipType ? "yes" : "no",
  };
}

export function formatRoom(room: any, hasPackage: boolean, hasDeal: boolean) {
  const data = formatRoomData(
    { ...room, type: "room", offer: formatOfferData(room) },
    +room.room.price,
  );
  return {
    ...data,
    total_price: hasPackage || hasDeal ? 0 : +data.total_price,
    original_price: hasPackage || hasDeal ? 0 : +data.original_price,
    is_package: hasPackage ? "yes" : "no",
    is_deal: hasDeal ? "yes" : "no",
  };
}
