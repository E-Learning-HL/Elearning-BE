export enum SurveyQuestionType {
  SIMPLE_CHOICE = 'simple_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  MULTIPLE_LINE = 'text_box',
  SINGLE_LINE_WIHTOUT_ANSWER = 'char_box',
  NUMERIC = 'numerical_box',
  DATE = 'date',
  DATETIME = 'datetime',
  MATRIX = 'matrix',
  SINGLE_LINE_WITH_ANSWER = 'only_text',
  SELECT = 'drop_down',
  ONLY_TITLE = 'title',
  AUDIO = 'audio',
  RECORDING = 'recording',
}

export const SCORE_IN_QUESTIONS = [
  SurveyQuestionType.MULTIPLE_LINE,
  SurveyQuestionType.SINGLE_LINE_WIHTOUT_ANSWER,
  SurveyQuestionType.NUMERIC,
  SurveyQuestionType.DATE,
  SurveyQuestionType.DATETIME,
  SurveyQuestionType.SINGLE_LINE_WITH_ANSWER,
];

export const SCORE_IN_SUGGESTIONS = [
  SurveyQuestionType.SIMPLE_CHOICE,
  SurveyQuestionType.MULTIPLE_CHOICE,
  SurveyQuestionType.MATRIX,
  SurveyQuestionType.SELECT,
];
