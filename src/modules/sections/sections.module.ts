import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { Section } from './entities/section.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService],
  imports: [TypeOrmModule.forFeature([Section])],
})
export class SectionsModule {}
