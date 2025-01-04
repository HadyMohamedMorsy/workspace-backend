import { SetMetadata } from "@nestjs/common";
import { PermissionsUser } from "src/users/user.entity";

export const PERMISSIONS_KEY = "permissions";

export const Permissions = (permissions: PermissionsUser[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
