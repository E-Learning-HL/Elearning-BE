import { SurveyQuestionType } from 'src/modules/survey/survey_question/enums/question_type.enum';
import { AnswerSaver } from '../answer_save/saving_answer';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export abstract class AbstractSavingFactory {
  constructor(protected datasoucre: DataSource) {}
  public abstract create(questionType: SurveyQuestionType): AnswerSaver;
}
