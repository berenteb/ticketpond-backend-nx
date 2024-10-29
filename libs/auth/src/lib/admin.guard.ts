import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtUser, PermissionLevel } from '@ticketpond-backend-nx/types';

export function PermissionGuard(...permissions: PermissionLevel[]) {
  return class PermissionGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtUser;
      return (
        user &&
        user.permissions &&
        user.permissions.some((permission) => permissions.includes(permission))
      );
    }
  };
}
