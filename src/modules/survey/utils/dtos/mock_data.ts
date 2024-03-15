/**
 * Khi học viên làm bài xong, sẽ post một cục data nó trông như thế này
 */

import {
  SurveyPostParamsDto,
  SurveyPostUserAnswerDto,
} from './survey_post_params.dto';

const map = new Map<number, SurveyPostUserAnswerDto>();

export const bodyExample = {
  /**
   * Phần lưu câu trả lời cấu trúc bao gồm:
   * Một dictionary có key là id của câu trả lời (Đối với question type dạng
   * simple choice, multiple choice, matrix, )
   */
  answers: {
    11: {
      value: 22,
    },
    12: {
      value: [25, 26],
    },
    13: {
      value: [29, 31],
    },
    14: {
      value: [35, 35],
    },
    15: {
      value: "Ok, it's good",
    },
  },
};
