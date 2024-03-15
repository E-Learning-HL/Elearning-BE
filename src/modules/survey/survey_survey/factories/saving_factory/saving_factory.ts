import { SurveyQuestionType } from 'src/modules/survey/survey_question/enums/question_type.enum';
import { AbstractSavingFactory } from './abstract_saving_factory';
import {
  AnswerSaver,
  DateSaver,
  InputSaver,
  InputWithAnswerSaver,
  MatrixSaver,
  MultipleChoiceSaver,
  NumericSaver,
  RecordingSaver,
} from '../answer_save/saving_answer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SavingSurveyInputFactory extends AbstractSavingFactory {
  public create(questionType: SurveyQuestionType): AnswerSaver {
    switch (questionType) {
      case SurveyQuestionType.SIMPLE_CHOICE:
      case SurveyQuestionType.SELECT:
      case SurveyQuestionType.MULTIPLE_CHOICE:
        return new MultipleChoiceSaver(this.datasoucre);
      case SurveyQuestionType.MATRIX:
        return new MatrixSaver(this.datasoucre);
      case SurveyQuestionType.DATE:
      case SurveyQuestionType.DATETIME:
        return new DateSaver(this.datasoucre);
      case SurveyQuestionType.NUMERIC:
        return new NumericSaver(this.datasoucre);
      case SurveyQuestionType.SINGLE_LINE_WITH_ANSWER:
        return new InputWithAnswerSaver(this.datasoucre);
      case SurveyQuestionType.RECORDING:
        return new RecordingSaver(this.datasoucre);
      default:
        //  SurveyQuestionType.SINGLE_LINE_WIHTOUT_ANSWER:
        return new InputSaver(this.datasoucre);
    }
  }
}
