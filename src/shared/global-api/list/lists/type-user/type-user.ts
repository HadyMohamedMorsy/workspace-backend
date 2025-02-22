import { TypeUser } from "src/shared/enum/global-enum";

export const LIST_TYPE_USER_EN = [
  { value: null, label: "All" },
  { value: TypeUser.Individual, label: "Individual" },
  { value: TypeUser.Company, label: "Company" },
  { value: TypeUser.StudentActivity, label: "StudentActivity" },
  { value: TypeUser.User, label: "User" },
];

export const LIST_TYPE_USER_AR = [
  { value: null, label: "الكل" },
  { value: TypeUser.Individual, label: "فرد" },
  { value: TypeUser.Company, label: "شركه" },
  { value: TypeUser.StudentActivity, label: "نشاط الطلبه" },
  { value: TypeUser.User, label: "موظف" },
];
