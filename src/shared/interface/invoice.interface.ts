import { PaymentMethod } from "../enum/global-enum";

export interface Invoice {
  deskarea: Deskarea[];
  shared: Shared[];
  room: Room[];
  order: { id: number }[];
}

export interface Deskarea {
  id: number;
  start_time: string;
  start_hour: string;
  start_minute: string;
  end_time: string;
  end_hour: number;
  end_minute: number;
  total_price: number;
  total_time: number;
  offer_type: string;
  discount_amount: number;
  is_full_day: boolean;
  is_membership: "yes" | "no";
  payment_method: PaymentMethod;
  status: string;
}

export interface Shared {
  id: number;
  start_time: string;
  start_hour: string;
  start_minute: string;
  end_time: string;
  end_hour: number;
  end_minute: number;
  total_price: number;
  total_time: number;
  offer_type: string;
  discount_amount: number;
  is_full_day: boolean;
  is_membership: "yes" | "no";
  payment_method: PaymentMethod;
  status: string;
}

export interface Room {
  id: number;
  start_time: string;
  start_hour: string;
  start_minute: string;
  end_time: string;
  end_hour: number;
  end_minute: number;
  total_time: number;
  offer_type: string;
  discount_amount: number;
  original_price: number;
  is_deal: "yes" | "no";
  is_package: "yes" | "no";
  payment_method: PaymentMethod;
  status: string;
}
