import { Module } from '@nestjs/common';
import { ExamItemsService } from './exam_items.service';
import { ExamItemsController } from './exam_items.controller';

@Module({
  controllers: [ExamItemsController],
  providers: [ExamItemsService]
})
export class ExamItemsModule {}
