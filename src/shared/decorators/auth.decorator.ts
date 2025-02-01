import { SetMetadata } from "@nestjs/common";
import { AuthType } from "../enum/global-enum";

export const AUTH_TYPE_KEY = "Bearer";

export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
