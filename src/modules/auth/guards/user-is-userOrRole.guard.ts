import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserIsUserOrHasRoleGuard
  extends RolesGuard
  implements CanActivate
{
  constructor(
    private readonly usersService: UsersService,
    protected readonly reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user, params } = request;

    const owner = await this.usersService.findOne(params?.id);

    if (user && user?.username === owner?.username) return true;

    return super.canActivate(context);
  }
}
