import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';
import {
  SurveyGetPageDto,
  SurveyGetQuestionDto,
} from '../../utils/dtos/survey_get_params.dto';

export type PaginationSurveyResult = {
  data: {
    pages: SurveyGetPageDto[] | SurveyGetQuestionDto[];
    numberOfPage: number;
    currentPage: number;
    hasNextPage: boolean;
  };
};
