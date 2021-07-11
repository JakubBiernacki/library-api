import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BorrowService } from '../borrow.service';
import { UserRole } from '../../users/enums/user-role';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private readonly borrowService: BorrowService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user } = request;
    const { id } = request.params;

    const borrow = await this.borrowService.findOne(id);

    return (
      borrow.employee_borrow.id === user.id || user.role === UserRole.ADMIN
    );
  }
}
