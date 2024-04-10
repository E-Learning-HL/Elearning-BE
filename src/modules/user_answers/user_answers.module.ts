import { Module } from '@nestjs/common';
import { UserAnswersService } from './user_answers.service';
import { UserAnswersController } from './user_answers.controller';

@Module({
  controllers: [UserAnswersController],
  providers: [UserAnswersService]
})
export class UserAnswersModule {}
