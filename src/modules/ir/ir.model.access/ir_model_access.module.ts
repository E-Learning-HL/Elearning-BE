import { Module } from '@nestjs/common';
import { IrModelAccessService } from './ir_model_access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrModelAccess } from './entities/ir_model_access.entity';

@Module({
  providers: [IrModelAccessService],
  exports: [IrModelAccessService],
  imports: [TypeOrmModule.forFeature([IrModelAccess])],
})
export class IrModelAccessModule {}
