import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyQuestionAnswer } from './entities/survey_question_answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyQuestionAnswerService {
  constructor(
    @InjectRepository(SurveyQuestionAnswer)
    private readonly repos: Repository<SurveyQuestionAnswer>,
  ) {}
}
