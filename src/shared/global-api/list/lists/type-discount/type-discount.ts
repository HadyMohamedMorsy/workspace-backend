import { DiscountType } from "src/general-offer/dto/create-general-offer.dto";

export const LIST_TYPE_DISCOUNT_EN = [
  { value: null, label: "All" },
  { value: DiscountType.PERCENTAGE, label: DiscountType.PERCENTAGE },
  { value: DiscountType.AMOUNT, label: DiscountType.AMOUNT },
];

export const LIST_TYPE_DISCOUNT_AR = [
  { value: null, label: "الكل" },
  { value: DiscountType.PERCENTAGE, label: "نسبه مئويه" },
  { value: DiscountType.AMOUNT, label: "خصم ثابت" },
];
