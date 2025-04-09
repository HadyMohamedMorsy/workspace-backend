import { PaymentMethod } from "src/shared/enum/global-enum";

export const PAYMENT_METHODS_EN = [
  { value: null, label: "All" },
  { value: "cach", label: PaymentMethod.Cach },
  { value: "instapay", label: PaymentMethod.Instapay },
  { value: "visa", label: PaymentMethod.Visa },
  { value: "vodafone-cach", label: PaymentMethod.VodafoneCach },
];
