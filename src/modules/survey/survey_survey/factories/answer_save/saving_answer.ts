import { SurveyQuestion } from 'src/modules/survey/survey_question/entities/survey_question.entity';
import { SurveyUserInput } from 'src/modules/survey/survey_user_input/entities/survey_user_input.entity';
import { SurveyUserInputLine } from 'src/modules/survey/survey_user_input_line/entities/survey_user_input_line.entity';
import {
  MatrixAnswerDto,
  SurveyPostUserAnswerDto,
} from 'src/modules/survey/utils/dtos/survey_post_params.dto';
import { Survey } from '../../entities/survey_survey.entity';
import { DataSource } from 'typeorm';
import { SurveyAnswerType } from 'src/modules/survey/survey_user_input_line/enums/survey_user_input_line.enum';
import { SurveyQuestionAnswer } from 'src/modules/survey/survey_question_answer/entities/survey_question_answer.entity';
import { SurveyQuestionType } from 'src/modules/survey/survey_question/enums/question_type.enum';
import { IrServer } from 'src/modules/ir/ir-server/entities/ir_server.entity';
import { IrAttachment } from 'src/modules/ir/ir_attachment/entities/ir_attachment.entity';
import { HttpStatus, Inject, Logger } from '@nestjs/common';
import { type } from 'os';
import { SurveyException } from '../../exceptions/survey.exception';
import { SurveyScoringType } from '../../enums/scoring_type.enum';
import { removeDupWhiteSpaces } from '../../utils/remove_whitespace';

export abstract class AnswerSaver {
  constructor(@Inject() protected datasource: DataSource) {}

  score(
    survey: Survey,
    input: SurveyUserInput,
    line: SurveyUserInputLine,
    expresstion: boolean,
    score: number,
  ) {
    if (expresstion) {
      line.answerIsCorrect = true;
      line.answerScore = score || 0;
      input.scoringTotal += score || 0;
    }
  }
  abstract validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ): Promise<SurveyUserInputLine[]>;
  protected async _oldAnswer(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
  ) {
    return new SurveyUserInputLine();
  }
  protected async _link(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    line: SurveyUserInputLine,
  ) {
    line.question = question;
    line.survey = survey;

    line.userInput = input;
    if (input.lines == undefined) {
      input.lines = [];
    }
    input.lines.push(line);
  }
}
export abstract class InputAnswerSaver extends AnswerSaver {
  constructor(@Inject() datasource: DataSource) {
    super(datasource);
  }
}
export abstract class ChoiceAnswerSaver extends AnswerSaver {
  constructor(@Inject() datasource: DataSource) {
    super(datasource);
  }

  async checkAnswerExist(answerId: number, question: SurveyQuestion) {
    let answerObject: any = undefined;

    try {
      answerObject =
        question.suggestedAnswers.find((e) => e.id == answerId) ||
        question.maxtrixSuggestedAnswers.find((e) => e.id == answerId);
    } catch (error) {
      Logger.error(error);
    }

    if (answerObject == undefined) {
      throw {
        message: `Answer ${answerId} is not belong to question ${question.id}`,
      };
    }
    return answerObject;
  }
}

export class MultipleChoiceSaver extends ChoiceAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    // convert to array:
    const lines: SurveyUserInputLine[] = [];
    if (
      typeof answer.value == 'number' ||
      (typeof answer.value == 'string' && answer.value != '')
    ) {
      answer.value = [Number(answer.value)];
    }

    answer.value = answer.value as number[];

    if (answer.value.length == 0) {
      answer.value = undefined;
    }

    if (answer.value == undefined) {
      const line = new SurveyUserInputLine();
      line.answerType = SurveyAnswerType.SUGGESTION;
      line.isSkipped = true;
      this._link(survey, question, input, line);
      lines.push(line);
    } else {
      try {
        for (let answerObj of answer.value as Array<any>) {
          let line = new SurveyUserInputLine();
          let answerId = answerObj;
          let correctedValue = '';
          if (question.isCorrectingQuestion) {
            answerId = answerObj.id as number;
          }
          const answerObject = await this.checkAnswerExist(answerId, question);
          const isUserSelectCorrect = answerObject.isCorrect == true;
          this.score(
            survey,
            input,
            line,
            question.isCorrectingQuestion &&
              answerObject.correctedAnswer != undefined
              ? isUserSelectCorrect &&
                  answerObj.value == answerObject.correctedAnswer
              : isUserSelectCorrect,
            answerObject.answerScore,
          );

          if (question.isCorrectingQuestion) {
            try {
              line.valueOnlyText = answerObj.value;
            } catch (err) {
              Logger.error(err);
            }
          }

          line.answerType = SurveyAnswerType.SUGGESTION;
          line.userAnswer = answerObject;
          this._link(survey, question, input, line);
          lines.push(line);
        }
      } catch (err) {
        Logger.error(err);
        throw {
          message: err,
          code: HttpStatus.BAD_REQUEST,
          cause: err,
        } as SurveyException;
      }
    }
    return lines;
  }
}
export class MatrixSaver extends ChoiceAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    // convert to array:
    const lines: SurveyUserInputLine[] = [];
    if (answer.value == undefined) {
      const line = new SurveyUserInputLine();
      line.answerType = SurveyAnswerType.SUGGESTION;
      line.isSkipped = true;
      this._link(survey, question, input, line);
      lines.push(line);
    } else {
      try {
        for (let answerId of answer.value as Array<MatrixAnswerDto>) {
          let line = new SurveyUserInputLine();
          const rowAnswer = await this.checkAnswerExist(answerId.row, question);
          const colAnswer = await this.checkAnswerExist(answerId.col, question);
          // matrix no scoring by default

          line.answerType = SurveyAnswerType.SUGGESTION;
          line.userAnswerMatrixRow = rowAnswer;
          line.userAnswer = colAnswer;
          this._link(survey, question, input, line);
          lines.push(line);
        }
      } catch (err) {
        throw {
          message: err.message,
          cause: `${answer.value} is unprocessable.`,
          code: HttpStatus.BAD_REQUEST,
        } as SurveyException;
      }
    }
    return lines;
  }
}

export class InputSaver extends InputAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    // safely convert number | string to string only
    answer.value = answer.value ? (answer.value + '').trim() : '';
    let line = await this._oldAnswer(survey, question, input);

    if (answer.value == undefined || (answer.value as string).trim() == '') {
      line.isSkipped = true;
      line.answerType = question.questionType.toString() as SurveyAnswerType;
      this._link(survey, question, input, line);
      return [line];
    }
    // chua tinh diem huhu

    switch (question.questionType) {
      case SurveyQuestionType.SINGLE_LINE_WIHTOUT_ANSWER:
        line.valueCharBox = answer.value;
        // odoo doesn't score this type of answer, but future can
        // if (question.isScoredQuesiton && question.answerOnlyText) {
        // }
        if (question.saveAsEmail) {
          input.email = line.valueCharBox;
        }
        if (question.saveAsNickName) {
          input.nickname = line.valueCharBox;
        }
        line.answerType = SurveyAnswerType.CHAR;
        break;
      case SurveyQuestionType.MULTIPLE_LINE:
        line.answerType = SurveyAnswerType.TEXT;
        line.valueTextBox = answer.value;
        break;
    }

    this._link(survey, question, input, line);
    return [line];
    // this.datasource.getRepository(SurveyUserInputLine).validate(input);
  }
}

export class InputWithAnswerSaver extends InputAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    let line = await this._oldAnswer(survey, question, input);
    answer.value = answer.value ? (answer.value + '').trim() : '';

    if (answer.value == undefined || answer.value == '') {
      line.isSkipped = true;
      line.answerType = SurveyAnswerType.ONLYTEXT;
      this._link(survey, question, input, line);
      return [line];
    }
    // safely convert number | string to string only

    line.valueOnlyText = removeDupWhiteSpaces(answer.value);
    line.answerType = SurveyAnswerType.ONLYTEXT;

    this.score(
      survey,
      input,
      line,
      question.suggestedAnswers
        .map((e) => {
          return e.value.en_US.toLowerCase();
        })
        .includes(line.valueOnlyText.toLowerCase()),
      question.answerScore,
    );
    this._link(survey, question, input, line);
    return [line];
    // this.datasource.getRepository(SurveyUserInputLine).save(input);
  }
}

export class DateSaver extends InputAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    let line = await this._oldAnswer(survey, question, input);

    if (answer.value == undefined) {
      line.answerType =
        question.questionType == SurveyQuestionType.DATE
          ? SurveyAnswerType.DATE
          : SurveyAnswerType.DATETIME;
      line.isSkipped = true;
      this._link(survey, question, input, line);
      return [line];
    }
    // safely convert number | string to string only
    try {
      // answer.value = answer.value as Date;
      answer.value = new Date(answer.value as string);
    } catch {
      throw {
        message: 'Not a valid date format.',
        code: HttpStatus.BAD_REQUEST,
        cause: `${answer.value} : which is expected to be a date.`,
      } as SurveyException;
    }
    if (question.answerDate) {
      switch (question.questionType) {
        case SurveyQuestionType.DATE:
          this.score(
            survey,
            input,
            line,
            answer.value.toLocaleString() ==
              question.answerDate.toLocaleDateString(),
            question.answerScore,
          );
          break;
        case SurveyQuestionType.DATETIME:
          this.score(
            survey,
            input,
            line,
            (question.answerDate.toLocaleDateString() ==
              answer.value.toLocaleString()) ==
              (question.answerDate.toLocaleTimeString() ==
                answer.value.toLocaleTimeString()),
            question.answerScore,
          );
      }
    }

    switch (question.questionType) {
      case SurveyQuestionType.DATE:
        line.answerType = SurveyAnswerType.DATE;
        line.valueDate = answer.value;
        break;
      case SurveyQuestionType.DATETIME:
        line.answerType = SurveyAnswerType.DATETIME;
        line.valueDatetime = answer.value;
    }

    this._link(survey, question, input, line);
    return [line];
  }
}

export class NumericSaver extends InputAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    let line = await this._oldAnswer(survey, question, input);
    line.answerType = SurveyAnswerType.NUMBER;

    if (answer.value == undefined) {
      line.isSkipped = true;
      this._link(survey, question, input, line);
      return [line];
    }

    try {
      answer.value = Number(answer.value);
    } catch {
      throw {
        message: 'Not a number',
        code: HttpStatus.BAD_REQUEST,
        cause: `${answer.value} is not a valid number.`,
      } as SurveyException;
    }

    if (question.validationRequired) {
      if (
        answer.value < question.validationMinFloatValue ||
        answer.value > question.validationMaxFloatValue
      ) {
        throw {
          message: `Question ${question.id} is not validated properly.`,
          code: HttpStatus.BAD_REQUEST,
        } as SurveyException;
      }
    }

    this.score(
      survey,
      input,
      line,
      question.answerNumericalBox == answer.value,
      question.answerScore,
    );
    line.valueNumericalBox = answer.value;
    this._link(survey, question, input, line);
    // this.datasource.getRepository(SurveyUserInputLine).validate(input);
    return [line];
  }
}

export class RecordingSaver extends InputAnswerSaver {
  async validate(
    survey: Survey,
    question: SurveyQuestion,
    input: SurveyUserInput,
    answer: SurveyPostUserAnswerDto,
  ) {
    const line = new SurveyUserInputLine();
    line.answerType = SurveyAnswerType.RECORDING;

    if (answer.value == undefined) {
      line.isSkipped = true;
      this._link(survey, question, input, line);
      return [line];
    }
    answer.value = answer.value as string;
    line.valueAudio = answer.value;
    this._link(survey, question, input, line);
    return [line];
  }
}
