import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrModuleCategory } from './entities/ir_module_category.entity';
import { IrModuleCategoryService } from './ir_module_category.service';

@Module({
  providers: [IrModuleCategoryService],
  imports: [TypeOrmModule.forFeature([IrModuleCategory])],
  exports: [IrModuleCategoryService],
})
export class IrModuleCategoryModule {}
