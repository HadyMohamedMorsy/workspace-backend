import { Permission } from "src/users/enum/permissions-enum";
import { PermissionsUser } from "src/users/user.entity";

export const PERMISSIONS_TREE: PermissionsUser[] = [
  {
    resource: "individual",
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: "studentActivity",
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: "company",
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
  {
    resource: "user",
    actions: [
      Permission.CREATE,
      Permission.UPDATE,
      Permission.VIEW,
      Permission.DELETE,
      Permission.INDEX,
    ],
  },
];
