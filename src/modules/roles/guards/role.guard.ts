// role.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/role.enum';
import { ROLE_KEY } from '../role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!requiredRoles) {
      return true; // No role requirements, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    console.log("user", user)
    console.log("user.role", user.role)
    if (!user || !user.role) {
      throw new UnauthorizedException('Invalid user or role');
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
