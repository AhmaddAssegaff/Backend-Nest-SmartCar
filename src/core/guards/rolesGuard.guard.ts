import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user?.roles) {
      throw new UnauthorizedException('User not authenticated or roles missing');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new UnauthorizedException('You do not have the necessary roles');
    }

    return true;
  }
}
