import { Resource } from "src/auth/enums/auth-type.enum";
import { Permission } from "src/users/enum/permissions-enum";
import { PermissionsUser } from "src/users/user.entity";

export const PERMISSIONS_TREE: PermissionsUser[] = [
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
    resource: Resource.Order,
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];
