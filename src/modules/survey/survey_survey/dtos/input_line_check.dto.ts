import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { SurveyState } from '../enums/survey_state.enum';

export class InputHistoryCheckDto {
  @ApiProperty()
  canDoTest: boolean;

  @ApiPropertyOptional()
  user?: Partial<User>;

  @ApiPropertyOptional()
  message?: string;
}
