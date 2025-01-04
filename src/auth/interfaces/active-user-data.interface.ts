import { PermissionsUser } from "src/users/user.entity";

export interface ActiveUserData {
  /**
   * The ID of the user
   */
  id: number;

  sub: number;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's email address
   */
  permission: PermissionsUser[];
}
