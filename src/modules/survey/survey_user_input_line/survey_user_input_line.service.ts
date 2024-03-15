import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyUserInput } from '../survey_user_input/entities/survey_user_input.entity';
import { Repository } from 'typeorm';
import { SurveyUserInputLine } from './entities/survey_user_input_line.entity';

@Injectable()
export class SurveyUserInputLineService {
  constructor(
    @InjectRepository(SurveyUserInputLine)
    private readonly repos: Repository<SurveyUserInputLine>,
  ) {}

  public async saveLine(line: SurveyUserInputLine[]) {
    return await this.repos.save(line, {
      transaction: true,
    });
  }
}
