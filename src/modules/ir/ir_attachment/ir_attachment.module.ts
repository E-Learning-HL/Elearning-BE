import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrAttachment } from './entities/ir_attachment.entity';
import { IrAttachmentService } from './ir_attachment.service';

@Module({
  imports: [TypeOrmModule.forFeature([IrAttachment])],
  providers: [IrAttachmentService],
  exports: [IrAttachmentService],
})
export class IrAttachmentModule {}
