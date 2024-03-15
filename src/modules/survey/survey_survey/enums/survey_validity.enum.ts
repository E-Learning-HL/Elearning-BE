export enum SurveyValidity {
  SURVEY_OK = 'Ready to start.',
  SURVEY_WRONG = 'Cannot find any survey.',
  SURVEY_AUTH = 'Need authorization.',
  SURVEY_CLOSED = 'Survey has closed.',
  SURVEY_VOID = 'Survey has no data.',
  TOKEN_WRONG = 'Provided token is not valid.',
  TOKEN_REQUIRED = 'Required an access token.',
}
