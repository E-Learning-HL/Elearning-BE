import { Module } from '@nestjs/common';
import { ExamTypesService } from './exam_types.service';
import { ExamTypesController } from './exam_types.controller';

@Module({
  controllers: [ExamTypesController],
  providers: [ExamTypesService]
})
export class ExamTypesModule {}
