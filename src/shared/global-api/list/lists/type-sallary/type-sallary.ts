import { TypeSallary } from "src/shared/enum/global-enum";

export const LIST_TYPE_SALLARY_EN = [
  { value: null, label: "All" },
  { value: TypeSallary.Internal, label: TypeSallary.Internal },
  { value: TypeSallary.External, label: TypeSallary.External },
];

export const LIST_TYPE_SALLARY_AR = [
  { value: null, label: "All" },
  { value: TypeSallary.Internal, label: "داخلي" },
  { value: TypeSallary.External, label: "خارجي" },
];
