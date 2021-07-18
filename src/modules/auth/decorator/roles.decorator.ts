import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-role';

export const ROLES_KEY = 'roles';
export const AllowRoles = (...roles: UserRole[] | boolean[]) =>
  SetMetadata(ROLES_KEY, roles);
