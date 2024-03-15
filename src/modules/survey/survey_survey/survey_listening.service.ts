import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/survey_survey.entity';
import { And, DataSource, EntityManager, In, Repository } from 'typeorm';
import { SurveyQuestionService } from '../survey_question/survey_question.service';
import { SurveyQuestionAnswerService } from '../survey_question_answer/survey_question_answer.service';
import { SurveyUserInputService } from '../survey_user_input/survey_user_input.service';
import { SurveyUserInputLineService } from '../survey_user_input_line/survey_user_input_line.service';
import { SurveyAccessMode } from './enums/access_mode.enum';
import { IrAttachmentService } from 'src/modules/ir/ir_attachment/ir_attachment.service';
import { SurveyService } from './survey.service';
import { SurveyQuestionType } from '../survey_question/enums/question_type.enum';
import {
  SurveyGetAnswertDto,
  SurveyGetMatrixSuggestionDto,
  SurveyGetPageDto,
  SurveyGetReturnDto,
} from '../utils/dtos/survey_get_params.dto';
import { AbstractSavingFactory } from './factories/saving_factory/abstract_saving_factory';
import { SurveyState } from './enums/survey_state.enum';
import { SurveyException } from './exceptions/survey.exception';
import { SurveyUserInput } from '../survey_user_input/entities/survey_user_input.entity';
import { accessSync } from 'node:fs';
import { SurveyUserInputLine } from '../survey_user_input_line/entities/survey_user_input_line.entity';
import { use } from 'passport';
import { toQuestionDto, toSurveyDto } from './utils/filter_data';
import { SurveyTagService } from '../survey_tag/survey_tag.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { SurveySkillService } from '../survey_skill/survey_skill.service';

@Injectable()
export class SurveyListeningService extends SurveyService {
  constructor(
    @InjectRepository(Survey) surveyRepos: Repository<Survey>,
    questService: SurveyQuestionService,
    answerService: SurveyQuestionAnswerService,
    surveyResultService: SurveyUserInputService,
    linesService: SurveyUserInputLineService,
    attachmentService: IrAttachmentService,
    savingFactory: AbstractSavingFactory,
    datasoucre: DataSource,
    tagService: SurveyTagService,
    skillsService: SurveySkillService,
  ) {
    super(
      surveyRepos,
      questService,
      answerService,
      surveyResultService,
      linesService,
      attachmentService,
      savingFactory,
      datasoucre,
      tagService,
    );
  }

  async saveResult(
    manager: EntityManager,
    input: SurveyUserInput,
    lines: SurveyUserInputLine[],
  ) {
    // filter out every line that was done in the previous reading and writing exam

    // i dont know where to startttttt. awwww

    //

    input.endExtraExam = new Date();
    input.isFullTest = true;
    const savedInput = await manager.save(input);
    const saved = await manager.save(lines);
    return {
      input: savedInput,
      lines: saved,
    };
  }

  userCanSubmit(input: SurveyUserInput) {
    if (!input.startExtraExam) {
      throw {
        message: 'This exam has not started yet.',
        code: HttpStatus.BAD_REQUEST,
      } as SurveyException;
    }
    if (input.state == SurveyState.DONE && input.isFullTest) {
      throw {
        message: "Token's expired.",
        code: HttpStatus.BAD_REQUEST,
      } as SurveyException;
    }
  }

  checkTimingOnSubmit(survey: Survey, input: SurveyUserInput) {
    if (survey.isTimeLimited) {
      const timeLimit = survey.timeLimitLs * 1000 * 60; // convert to miliseconds:
      const startTime = input.startExtraExam;

      const epsilon = (Number(process.env['TIMING_EPSILON']) || 1) * 60 * 1000; // 1 minute after timeLimit, user can submit his answers.$
      const current = new Date();

      if (current.getTime() > startTime.getTime() + epsilon + timeLimit) {
        return true;
      }
    }
    return false;
  }

  async getSurvey({
    accessToken,
    answerToken,
    page,
  }: {
    accessToken: string;
    answerToken?: string;
    page?: number;
  }): Promise<
    | (Partial<Survey> & {
        data: {
          pages: SurveyGetPageDto[];
          numberOfPage: number;
          currentPage: number;
          hasNextPage: boolean;
        };
      })
    | null
  > {
    // get survey

    const requiredSurvey = await this.surveyRepos.findOne({
      where: {
        accessToken: accessToken,
        active: true,
      },
    });

    if (requiredSurvey == null) {
      throw {
        message: 'Survey is not found.',
        cause: 'Invalid access token: ',
        code: HttpStatus.NOT_FOUND,
      } as SurveyException;
    }

    // group the page:

    const pages = new Map<number, SurveyGetPageDto>();

    const pageLsIds = await this.datasource.query(
      `Select x.id from survey_question x
              inner join survey_question y
              on x.id = y.page_id
              inner join survey_survey s
              on x.survey_id = s.id
              where y.question_type in ('audio','recording') and access_token = $1
              group by x.id
              order by x.sequence asc
              `,
      [accessToken],
    );

    let pageids = pageLsIds.map((e: any) => e.id);

    const pagesFromSurvey = await this.questService.getPages(
      {
        accessToken: accessToken,
        isRandomSurvey: false,
      },
      {
        page: page || 1,
        limit: 1,
      },
    );

    pageids = pagesFromSurvey.data.map((page) => page.id);

    for (let question of pagesFromSurvey.data) {
      const id = question.id;
      pages.set(id, {
        page: {
          questionId: id,
          description: question.description,
          title: question.title,
          audioFilename: question.audioFilename,
          deadline: undefined,
          limitSectionTime: 0,
          tagId: undefined,
          tagName: undefined,
        },
        questions: [],
      });
    }

    const questions = await this.questService.getQuestions({
      isRandomSurvey: false,
      accessToken: accessToken,
      inPages: pageids,
    });

    // this extracting data is too dirty, maybe we will fix it in the near future.
    questions.forEach((question) => {
      const p = pages.get(question.pageId)!;
      // suggested Answer:
      let suggestedAnswers:
        | SurveyGetAnswertDto[]
        | SurveyGetMatrixSuggestionDto;

      const cols = question.suggestedAnswers.map((answ) => {
        return {
          value: answ.value,
          answerScore: answ.answerScore,
          valueImageFileName: answ.valueImageFileName,
          id: answ.id,
          sequence: answ.sequence,
        };
      });
      if (question.questionType == SurveyQuestionType.MATRIX) {
        suggestedAnswers = {
          cols: cols,
          rols: question.maxtrixSuggestedAnswers.map((answ) => {
            return {
              value: answ.value,
              answerScore: answ.answerScore,
              valueImageFileName: answ.valueImageFileName,
              id: answ.id,
              sequence: answ.sequence,
            };
          }),
        };
      } else {
        suggestedAnswers = cols;
      }
      p.questions.push(toQuestionDto(question, suggestedAnswers));
    });

    return toSurveyDto(requiredSurvey, pagesFromSurvey, pages);
  }

  async startExisting(accessToken: string, answerToken: string, user?: any) {
    const existingInput = await this.surveyResultService.getInput(
      accessToken,
      answerToken,
    );

    const input = existingInput.input;

    this.checkInputAuthorized(input, user);

    // user has done the reading and writing test.
    /**
     * To actually start the lis&spk, user has to done the red&wrt test in odoo
     *
     */

    if (
      input.state == SurveyState.DONE &&
      (!input.endDatetime || !input.isFullTest)
    ) {
      // ok, user accesses this survey for the first time.
      if (!input.startExtraExam) {
        input.startExtraExam = new Date();
        const modifiedInputs = await this.surveyResultService.save([input]);
        existingInput.input = modifiedInputs[0];
      }

      return existingInput;
    }

    throw {
      message: 'Access deny.',
      cause: {
        inputState: input.state,
        startDatetime: input.startDatetime,
        endDatetime: input.endDatetime,
        answerToken: answerToken,
      },
      code: HttpStatus.UNAUTHORIZED,
    } as SurveyException;
  }
}
