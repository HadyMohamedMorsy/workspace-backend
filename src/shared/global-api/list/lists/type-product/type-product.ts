import { PRODUCT_TYPE } from "src/shared/enum/global-enum";

export const LIST_TYPE_PRODUCT_EN = [
  { value: null, label: "All" },
  { value: "rooms", label: PRODUCT_TYPE.Room },
  { value: "deskarea", label: PRODUCT_TYPE.Deskarea },
  { value: "shared", label: PRODUCT_TYPE.Shared },
  { value: "membership", label: PRODUCT_TYPE.Membership },
  { value: "deals", label: PRODUCT_TYPE.Deals },
  { value: "packages", label: PRODUCT_TYPE.Packages },
];

export const LIST_TYPE_PRODUCT_AR = [
  { value: null, label: "All" },
  { value: "rooms", label: "اوض" },
  { value: "deskarea", label: "ديسك اريا" },
  { value: "shared", label: "شيرد" },
];
