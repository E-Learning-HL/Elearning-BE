import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../permission.decorator';
import { Permission } from '../constants/permission.enum';
import { Role } from 'src/modules/roles/constants/role.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<Permission[]>(PERMISSIONS_KEY, context.getHandler());
    if (!requiredPermissions) {
      return true; // No permission requirements, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new UnauthorizedException('Invalid user or permissions');
    }

    // Assuming permissions are stored in a map where keys are role names
    const rolePermissions = {
      [Role.ADMIN]: [Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.READ],
      [Role.SUPER_ADMIN]: [Permission.CREATE, Permission.UPDATE, Permission.DELETE, Permission.READ],
      [Role.USER]: [Permission.CREATE, Permission.UPDATE, Permission.READ],

      // Add other roles and their permissions here
    };

    // Get permissions for user's role
    const userPermissions = rolePermissions[user.role];

    if (!userPermissions) {
      throw new UnauthorizedException('Invalid role or permissions');
    }

    // Check if user's role has required permissions
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
  }
}
