import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BorrowService } from '../borrow.service';
import { UserRole } from '../../users/enums/user-role';

@Injectable()
export class ClosedGuard implements CanActivate {
  constructor(private readonly borrowService: BorrowService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { role } = request.user;
    const { id } = request.params;

    const borrow = await this.borrowService.findOne(id);

    if (borrow.closed() && role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can modify a closed borrow');
    }

    return true;
  }
}
