import { Permission } from "./enum/permissions-enum";
import { PermissionsUser } from "./user.entity";

export const GENERALMANGER: PermissionsUser[] = [
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
      Permission.DELETE,
      Permission.VIEW,
      Permission.INDEX,
    ],
  },
];

export const OPERATIONMANGER: PermissionsUser[] = [
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

export const COMMUNITY_OFFICER: PermissionsUser[] = [
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

export const ACCOUNTANT: PermissionsUser[] = [
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

export const FOUNDER: PermissionsUser[] = [
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

export const SALES: PermissionsUser[] = [
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
