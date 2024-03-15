import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResGroup } from './entities/res_group.entity';
import { ResGroupService } from './res_group.service';
import { IrModuleCategoryModule } from 'src/modules/ir/ir-module-category/ir_module_category.module';

@Module({
  providers: [ResGroupService],
  imports: [TypeOrmModule.forFeature([ResGroup]), IrModuleCategoryModule],
  exports: [ResGroupService],
})
export class ResGroupModule {}
