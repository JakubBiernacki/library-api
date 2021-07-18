import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../../users/enums/user-role';
import { BaseGuard } from '../../../common/guards/base.guard';

@Injectable()
export class RolesGuard extends BaseGuard implements CanActivate {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (super.canActivate(context)) return true;

    const requiredRoles = this.reflector.getAllAndMerge<UserRole[] | boolean[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles.toString()) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role || role === true);
  }
}
