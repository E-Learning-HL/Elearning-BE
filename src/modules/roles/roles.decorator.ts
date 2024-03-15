import { SetMetadata } from '@nestjs/common';
import { BaseEntity } from 'src/database/base/base.entity';
import { EntityTarget } from 'typeorm';
import { PermissionMode } from '../ir/ir.model.access/enum/permission.enum';

export type RoleOption = {
  model: EntityTarget<any>;
  mode: PermissionMode;
  acceptPublic?: boolean;
};

export const Roles = (option: RoleOption) => SetMetadata('roles', option);
