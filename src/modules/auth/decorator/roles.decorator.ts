import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/users/dto/create-user.dto';

export const ROLES_KEY = 'roles';
export const AllowRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
