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

export interface ReservationTimeFields {
  reservation_start_time: string;
  reservation_start_hour: number;
  reservation_start_minute: number;
  reservation_end_time: string;
  reservation_end_hour: number;
  reservation_end_minute: number;
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
): number => {
  return (
    calculateHours({
      start_hour: startHour,
      start_minute: startMinute,
      start_time: startTime,
      end_hour: endHour,
      end_minute: endMinute,
      end_time: endTime,
    }) || 1
  );
};

export const calculateDiscount = (price: number, offer?: Offer): number => {
  if (!offer) return 0;

  if (offer.type === "PERCENTAGE") {
    return (price * offer.value) / 100;
  }

  return offer.value;
};

export const formatTimeFields = (data: any, createTime: TimeData, additionalPrefix = ""): any => {
  const prefix = additionalPrefix ? `${additionalPrefix}_` : "";

  return {
    start_time: data[`${prefix}start_time`] || data.start_time,
    start_hour: data[`${prefix}start_hour`] || data.start_hour,
    start_minute: data[`${prefix}start_minute`] || data.start_minute,
    end_time: data[`${prefix}end_time`] || data.end_time || createTime.timeOfDay,
    end_hour: data[`${prefix}end_hour`] || data.end_hour || createTime.hours,
    end_minute: data[`${prefix}end_minute`] || data.end_minute || createTime.minutes,
  };
};

export const formatTimeData = (data: any, price?: any, additionalPrefix = "") => {
  const createTime = getCurrentTime();
  const timeFields = formatTimeFields(data, createTime, additionalPrefix);

  const totalTime = calculateTotalTime(
    timeFields.start_hour,
    timeFields.start_minute,
    timeFields.start_time,
    timeFields.end_hour,
    timeFields.end_minute,
    timeFields.end_time,
  );

  const basePrice = data.is_full_day ? price : price * totalTime;
  const discount = calculateDiscount(basePrice, data.offer);
  const finalPrice = basePrice - discount;

  return {
    id: data.id,
    ...timeFields,
    total_price: finalPrice < 0 ? 0 : finalPrice,
    original_price: price,
    discount_amount: discount,
    total_time: totalTime,
    is_full_day: data.is_full_day,
    selected_day: data.selected_day,
    status: data.status,
    payment_method: data.payment_method,
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
    payment_method: order.payment_method,
  };
};

export const formatRoomData = (room: any, price: number) => {
  return {
    ...formatTimeData(room, price, "reservation"),
    room_id: room.room.id,
    room_name: room.room.name,
    room_price: room.room.price,
    room_featured_image: room.room.featured_image,
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
  const isMembership = hasMembership && isMembershipType;
  const totalTime =
    data.is_full_day || data.total_time > +settings.full_day_hours ? 1 : data.total_time;

  return {
    ...data,
    total_price: isMembership
      ? 0
      : getPriceCoWorkingSpace(
          { ...item, is_full_day: data.is_full_day || data.total_time > +settings.full_day_hours },
          type,
          settings,
        ) * totalTime,
    original_price: isMembership
      ? 0
      : getPriceCoWorkingSpace(
          { ...item, is_full_day: data.is_full_day || data.total_time > +settings.full_day_hours },
          type,
          settings,
        ) * totalTime,
    is_membership: isMembership ? "yes" : "no",
    assign_membership_id: item.assign_membership_id,
    last_time_membership: item.lastTimeMembership,
    is_full_day: data.is_full_day || data.total_time > +settings.full_day_hours,
  };
}

export function formatRoom(room: any, hasPackage: boolean, hasDeal: boolean) {
  const data = formatRoomData(
    { ...room, type: "room", offer: formatOfferData(room) },
    +room.room.price,
  );
  return {
    ...data,
    last_time_package: data.lastTimePackage,
    last_time_deal: data.lastTimeDeal,
    total_price: hasPackage || hasDeal ? 0 : +data.total_price,
    original_price: hasPackage || hasDeal ? 0 : +data.original_price,
    is_package: hasPackage ? "yes" : "no",
    is_deal: hasDeal ? "yes" : "no",
    assign_deal_id: room.assign_deal_id,
    assign_package_id: room.assign_package_id,
  };
}

export const getTotalTime = (
  totalTime: number,
  isFullDay: boolean,
  fullDayHours: number,
): number => {
  return isFullDay || totalTime > fullDayHours || totalTime == 0 ? 1 : totalTime;
};

export const selectingInvoice = [
  "s.id",
  "s.start_time",
  "s.start_hour",
  "s.start_minute",
  "s.end_time",
  "s.end_hour",
  "s.end_minute",
  "s.total_price",
  "s.total_time",
  "s.is_full_day",
  "s.status",
  "s.payment_method",
  "s.selected_day",
  "sgo.id",
  "sgo_offer.id",
  "sgo_offer.type_discount",
  "sgo_offer.discount",
  "d.id",
  "d.start_time",
  "d.start_hour",
  "d.start_minute",
  "d.end_time",
  "d.end_hour",
  "d.status",
  "d.end_minute",
  "d.total_price",
  "d.total_time",
  "d.payment_method",
  "d.is_full_day",
  "d.selected_day",
  "dgo.id",
  "dgo_offer.id",
  "dgo_offer.type_discount",
  "dgo_offer.discount",
  "eo.id",
  "eo.order_number",
  "eo.order_price",
  "eo.total_order",
  "eo.payment_method",
  "r.id",
  "r.reservation_start_time",
  "r.reservation_start_hour",
  "r.reservation_start_minute",
  "r.reservation_end_time",
  "r.reservation_end_hour",
  "r.reservation_end_minute",
  "r.status",
  "r.payment_method",
  "r.total_price",
  "r.total_time",
  "r.selected_day",
  "room.id",
  "room.name",
  "room.price",
  "room.featured_image",
  "rgo.id",
  "rgo_offer.id",
  "rgo_offer.type_discount",
  "rgo_offer.discount",
  "am.id",
  "am.used",
  "am.total_used",
  "am.status",
  "ms.id",
  "ms.type",
  "assignesPackages.id",
  "assignesPackages.used",
  "assignesPackages.total_used",
  "assignesPackages.status",
  "deals.id",
  "deals.used",
  "deals.total_used",
  "deals.status",
];
