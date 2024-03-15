import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrModuleService } from './ir_module_module.service';
import { IrModule } from './entities/ir_module_module.entity';
import { IrModuleCategoryModule } from '../ir-module-category/ir_module_category.module';

@Module({
  imports: [TypeOrmModule.forFeature([IrModule]), IrModuleCategoryModule],
  providers: [IrModuleService],
  exports: [IrModuleService],
})
export class IrModuleModule {}
