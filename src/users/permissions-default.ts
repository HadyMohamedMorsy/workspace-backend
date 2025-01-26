import { Resource } from "src/auth/enums/auth-type.enum";
import { Permission } from "./enum/permissions-enum";
import { PermissionsUser } from "./user.entity";

export const GENERALMANGER: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.ExpensesPlace,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.ExpensesSalaries,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Product,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Category,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Purchases,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Returns,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.GeneralOffer,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Rooms,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.GeneralOffer,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.OfferWorkingSpace,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.OfferPackages,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Deals,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const OPERATIONMANGER: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const COMMUNITY_OFFICER: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const ACCOUNTANT: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const FOUNDER: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const SALES: PermissionsUser[] = [
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.StudentActivity,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Company,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.User,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];
