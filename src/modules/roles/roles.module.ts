import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrModel } from '../ir/ir-model/entities/ir_model.entity';
import { RoleService } from './roles.service';
import { ResGroupModule } from '../res/res-group/res_group.module';
import { IrModuleCategoryModule } from '../ir/ir-module-category/ir_module_category.module';
import { IrModelAccess } from '../ir/ir.model.access/entities/ir_model_access.entity';

@Module({
  providers: [RoleService],
  imports: [
    TypeOrmModule.forFeature([IrModel, IrModelAccess]),
    IrModuleCategoryModule,
    ResGroupModule,
  ],
  exports: [RoleService],
})
export class RoleModule {}
