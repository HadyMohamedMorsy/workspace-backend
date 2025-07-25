import { PaymentMethod, TypeOrder } from "../enum/global-enum";

export interface Invoice {
  deskarea: Deskarea[];
  shared: Shared[];
  room: Room[];
  order: {
    payment_method: PaymentMethod;
    id: number;
    type_order: TypeOrder;
  }[];
  customer_id?: number;
  customer_type?: string;
  total_price?: number;
  hasSettingSpecial?: boolean;
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
  offer_id?: number;
  last_time_membership?: boolean;
  assign_membership_id?: number;
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
  offer_id?: number;
  last_time_membership?: boolean;
  assign_membership_id?: number;
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
  offer_id?: number;
  last_time_package?: boolean;
  assign_package_id?: number;
  last_time_deal?: boolean;
  assign_deal_id?: number;
}
