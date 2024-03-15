import { PaginationResultType } from 'src/utils/types/pagination-result.type';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import {
  SurveyGetPageDto,
  SurveyGetQuestionDto,
} from '../../utils/dtos/survey_get_params.dto';
import { Survey } from '../entities/survey_survey.entity';
import { SurveyQuestionType } from '../../survey_question/enums/question_type.enum';

export function toQuestionDto(
  question: SurveyQuestion,
  suggestedAnswers: any,
): SurveyGetQuestionDto {
  let maxSelectionNumber: number | undefined = undefined;
  if (question.questionType == SurveyQuestionType.MULTIPLE_CHOICE) {
    maxSelectionNumber = 0;
    for (let i of question.suggestedAnswers) {
      if (i.isCorrect) {
        maxSelectionNumber += 1;
      }
    }

    if (maxSelectionNumber == 0) {
      // it means no correct answers are specified, so let user select all.
      maxSelectionNumber == undefined;
    }
  }
  return {
    deadline: question.deadline,
    limitSectionTime: question.limitSectionTime,
    questionId: question.id,
    isAnswerInBox: question.isAnswerInBox,
    title: question.title,
    constrMandatory: question.constrMandatory,
    description: question.description,
    isTimeLimited: question.isTimeLimited,
    questionType: question.questionType,
    saveAsEmail: question.saveAsNickName,
    saveAsNickName: question.saveAsNickName,
    sequence: question.sequence,
    timeLimit: question.timeLimit,
    validationLengthMax: question.validationLengthMax,
    validationLengthMin: question.validationLengthMin,
    audioFilename: question.audioFilename,
    constrErrorMsg: question.constrErrorMsg,
    questionPlaceholder: question.questionPlaceholder,
    validationErrorMsg: question.validationErrorMsg,
    suggestedAnswers: suggestedAnswers,
    isSubHeading: question.isSubHeading,
    limitListeningTimes: question.limitListeningTimes,
    maxSelectionNumber: maxSelectionNumber,
    pageId: question.pageId,
    isCorrectingQuestion: question.isCorrectingQuestion,
  };
}

export function toSurveyDto(
  requiredSurvey: Survey,
  pagesFromSurvey: PaginationResultType<SurveyQuestion>,
  pages: Map<number, SurveyGetPageDto>,
) {
  return {
    accessToken: requiredSurvey.accessToken,
    description: requiredSurvey.description,
    descriptionDone: requiredSurvey.descriptionDone,
    isAttemptsLimited: requiredSurvey.isAttemptsLimited,
    isTimeLimited: requiredSurvey.isTimeLimited,
    timeLimit: requiredSurvey.timeLimit,
    title: requiredSurvey.title,
    userCanGoback: requiredSurvey.userCanGoback,
    questionsLayout: requiredSurvey.questionsLayout,
    scoringType: requiredSurvey.scoringType,

    data: {
      hasNextPage: pagesFromSurvey.hasNextPage,
      currentPage: pagesFromSurvey.currentPage,
      pages: Array.from(pages.values()),
      numberOfPage: pagesFromSurvey.totalRecord,
    },
  };
}
