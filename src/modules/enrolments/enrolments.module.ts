import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { EnrolmentsController } from './enrolments.controller';
import { Enrolment } from './entities/enrolment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
  imports: [TypeOrmModule.forFeature([Enrolment])],
})
export class EnrolmentsModule {}
