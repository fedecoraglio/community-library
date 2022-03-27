import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Permission } from './permission';
import { Reflector } from '@nestjs/core';
import { PassportUser } from './passport-request';
import { UserService } from '../user.service';

export const PERMISSIONS_KEY = 'permissions';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const HasPermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class HasPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    const { user }: { user: PassportUser } = context
      .switchToHttp()
      .getRequest();

    const userPermissions = await this.usersService.getUserPermissions(user.id);

    return requiredPermissions.some((permission) =>
      userPermissions?.includes(permission),
    );
  }
}
