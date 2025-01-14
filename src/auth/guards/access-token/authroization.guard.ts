import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { REQUEST_USER_KEY } from "src/auth/constants/auth.constants";
import { AuthService } from "src/auth/providers/auth.service";
import { PERMISSIONS_KEY } from "src/shared/decorators/permissions.decorator";
import { PermissionsUser } from "src/users/user.entity";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request[REQUEST_USER_KEY]) {
      throw new UnauthorizedException("User not found");
    }

    const routePermissions: PermissionsUser[] = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!routePermissions) {
      return true;
    }

    try {
      const userPermissions = await this.authService.getUserPermissions(
        request[REQUEST_USER_KEY].id,
      );

      for (const routePermission of routePermissions) {
        const userPermission = userPermissions.find(
          perm => perm.resource === routePermission.resource,
        );

        if (!userPermission) throw new ForbiddenException();

        const allActionsAvailable = routePermission.actions.every(requiredAction =>
          userPermission.actions.includes(requiredAction),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
    return true;
  }
}
