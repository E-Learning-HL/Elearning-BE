import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleOption } from '../roles.decorator';
import { DataSource } from 'typeorm';
import { IrModelAccessService } from 'src/modules/ir/ir.model.access/ir_model_access.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private irAccessService: IrModelAccessService,
    private datasoucre: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleOption>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);

    const request = context.switchToHttp().getRequest();
    const noUserId = -1;
    const user = request.user;
    const id = user ? user.id : noUserId;
    const tableName = this.datasoucre.manager.connection.getMetadata(
      roles.model,
    ).tableName;

    return this.irAccessService.checkAccessRight({
      model: tableName.replace('_', '.'), // odoo convention in model name
      uid: id,
      mode: roles.mode,
    });
  }
}
