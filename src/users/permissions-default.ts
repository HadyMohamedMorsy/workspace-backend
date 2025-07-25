import { Permission, Resource } from "src/shared/enum/global-enum";
import { PermissionsUser } from "./user.entity";

export const TECHNICALSUPPORT: PermissionsUser[] = [
  {
    resource: Resource.Revenue,
    actions: [Permission.CREATE, Permission.DELETE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.Vacation,
    actions: [Permission.UPDATE, Permission.CREATE, Permission.INDEX, Permission.DELETE],
  },
  {
    resource: Resource.GeneralSettings,
    actions: [Permission.CREATE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.CustomSettings,
    actions: [Permission.CREATE, Permission.UPDATE],
  },
  {
    resource: Resource.Lookup,
    actions: [Permission.CREATE, Permission.DELETE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.UPDATE_PERMISSION,
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
  {
    resource: Resource.Task,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Deskarea,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Shared,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.ReservationRoom,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignGeneralOffer,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignesMembership,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignesPackage,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];

export const GENERALMANGER: PermissionsUser[] = [
  {
    resource: Resource.Lookup,
    actions: [Permission.CREATE, Permission.DELETE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.Revenue,
    actions: [Permission.CREATE, Permission.DELETE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.Vacation,
    actions: [Permission.UPDATE, Permission.CREATE, Permission.INDEX],
  },
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.UPDATE_PERMISSION,
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
    resource: Resource.GeneralSettings,
    actions: [Permission.CREATE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.CustomSettings,
    actions: [Permission.CREATE, Permission.UPDATE],
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
  {
    resource: Resource.Task,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Deskarea,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.Shared,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.ReservationRoom,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignGeneralOffer,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignesMembership,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
  {
    resource: Resource.AssignesPackage,
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
    resource: Resource.Lookup,
    actions: [Permission.CREATE, Permission.DELETE, Permission.UPDATE, Permission.INDEX],
  },
  {
    resource: Resource.Individual,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.UPDATE_PERMISSION,
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
      Permission.IMPORT,
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
      Permission.IMPORT,
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
      Permission.UPDATE_PERMISSION,
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
