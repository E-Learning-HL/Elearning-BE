import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from './entities/score.entity';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService],
  imports : [TypeOrmModule.forFeature([Score])]
})
export class ScoresModule {}
