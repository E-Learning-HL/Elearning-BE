import { SurveyQuestionType } from '../survey_question/enums/question_type.enum';

export abstract class Question {
  private static type: SurveyQuestionType = SurveyQuestionType.ONLY_TITLE;
}
