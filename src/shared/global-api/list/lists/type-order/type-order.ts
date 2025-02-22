import { TypeOrder } from "src/shared/enum/global-enum";

export const LIST_TYPE_ORDER_EN = [
  { value: null, label: "All" },
  { value: TypeOrder.HOLD, label: "Hold" },
  { value: TypeOrder.COST, label: "Cost" },
  { value: TypeOrder.FREE, label: "Free" },
  { value: TypeOrder.PAID, label: "Paid" },
];

export const LIST_TYPE_ORDER_AR = [
  { value: null, label: "All" },
  { value: TypeOrder.HOLD, label: "انتظار" },
  { value: TypeOrder.COST, label: "تكلفه" },
  { value: TypeOrder.FREE, label: "فري" },
  { value: TypeOrder.PAID, label: "مدفوع" },
];
