import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Survey } from './entities/survey_survey.entity';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { SurveyQuestionService } from '../survey_question/survey_question.service';
import { SurveyQuestionAnswerService } from '../survey_question_answer/survey_question_answer.service';
import { SurveyUserInputService } from '../survey_user_input/survey_user_input.service';
import { SurveyUserInputLineService } from '../survey_user_input_line/survey_user_input_line.service';
import { IrAttachmentService } from 'src/modules/ir/ir_attachment/ir_attachment.service';
import {
  SurveyGetAnswertDto,
  SurveyGetMatrixSuggestionDto,
  SurveyGetPageDto,
  SurveyGetQuestionDto,
} from '../utils/dtos/survey_get_params.dto';
import { SurveyState } from './enums/survey_state.enum';
import { AbstractSavingFactory } from './factories/saving_factory/abstract_saving_factory';
import { SurveyUserInputLine } from '../survey_user_input_line/entities/survey_user_input_line.entity';
import { SurveyPostParamsDto } from '../utils/dtos/survey_post_params.dto';
import { SurveyUserInput } from '../survey_user_input/entities/survey_user_input.entity';
import {
  SurveyException,
  SurveyExceptionCode,
} from './exceptions/survey.exception';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { SurveyQuestionType } from '../survey_question/enums/question_type.enum';
import { toQuestionDto, toSurveyDto } from './utils/filter_data';
import { paginate } from 'src/utils/pagination';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTagService } from '../survey_tag/survey_tag.service';
import { SurveyQuestion } from '../survey_question/entities/survey_question.entity';
import { SCORABLE_TYPES } from './types/scorable_type.const';
import { SurveyScoringType } from './enums/scoring_type.enum';
import { SurveyUserInputTagResult } from '../survey_tag_result/entities/survey_tag_result.entity';
import { SurveySkillService } from '../survey_skill/survey_skill.service';
import { SurveyTag } from '../survey_tag/entities/survey_tag.entity';
import { PaginationSurveyResult } from './types/pagination_survey';
import { SurveyInputQuestionRel } from '../survey_user_input/entities/survey_user_input_question.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    protected readonly surveyRepos: Repository<Survey>,
    protected readonly questService: SurveyQuestionService,
    protected readonly answerService: SurveyQuestionAnswerService,
    protected readonly surveyResultService: SurveyUserInputService,
    protected readonly linesService: SurveyUserInputLineService,
    protected readonly attachmentService: IrAttachmentService,
    protected readonly savingFactory: AbstractSavingFactory,
    protected readonly datasource: DataSource,
    protected readonly tagService: SurveyTagService,
  ) {}

  async count(where?: FindManyOptions<Survey>) {
    return await this.surveyRepos.count(where);
  }

  checkInputAuthorized(input: SurveyUserInput, user?: any) {
    const publicButUser = input.partner == null && user && user.partnerId;

    const privateButDiffUser =
      input.partner != null && user && input.partner.id != user.partnerId;

    const privateButNoUser =
      input.partner != null && (!user || !user.partnerId);

    if (publicButUser || privateButDiffUser || privateButNoUser) {
      throw {
        message: "You are not allowed to access other's exam.",
        code: HttpStatus.UNAUTHORIZED,
      } as SurveyException;
    }
  }

  async saveResult(
    manager: EntityManager,
    input: SurveyUserInput,
    lines: SurveyUserInputLine[],
  ) {
    input.endDatetime = new Date();
    input.state = SurveyState.DONE;
    const savedInput = await manager.save(input);
    const saved = await manager.save(lines);

    const results = await manager.save(input.tagResults);
    return {
      input: savedInput,
      lines: saved,
    };
  }

  userCanSubmit(input: SurveyUserInput) {
    if (input.state == SurveyState.NEW) {
      throw {
        message: 'This exam has not been started yet.',
        code: HttpStatus.BAD_REQUEST,
      } as SurveyException;
    }
    if (input.state == SurveyState.DONE) {
      throw {
        message: 'Exam ended.',
        code: HttpStatus.BAD_REQUEST,
      } as SurveyException;
    }
  }

  checkTimingOnSubmit(survey: Survey, input: SurveyUserInput) {
    if (survey.isTimeLimited) {
      const timeLimit = survey.timeLimit * 1000 * 60; // convert to miliseconds:
      const startTime = input.startDatetime;

      const epsilon = (Number(process.env['TIMING_EPSILON']) || 1) * 60 * 1000; // 1 minute after timeLimit, user can submit his answers.$
      const current = new Date();

      if (current.getTime() > startTime.getTime() + epsilon + timeLimit) {
        return true;
      }
    }

    return false;
  }

  async startExisting(accessToken: string, answerToken: string, user?: any) {
    const existingInput = await this.surveyResultService.getInput(
      accessToken,
      answerToken,
    );

    // no one can access other's exam.
    this.checkInputAuthorized(existingInput.input, user);

    const input = existingInput.input;

    if (input.state == SurveyState.DONE) {
      throw {
        message: 'You have done this exam.',
        cause: {
          inputState: input.state,
          startDatetime: input.startDatetime,
          endDatetime: input.endDatetime,
          answerToken: answerToken,
        },
        code: HttpStatus.FORBIDDEN,
      } as SurveyException;
    } else if (input.state == SurveyState.NEW) {
      input.state = SurveyState.IN_PROGRESS;
      input.startDatetime = new Date();
      (await this.surveyResultService.save([input]))[0]; // why returned undefined?
    }
    return existingInput;
  }
  protected checkRequiredAnswer(
    question: SurveyQuestion,
    answer: any | undefined,
  ) {
    if (
      question.constrMandatory &&
      (answer === undefined ||
        answer.value == undefined ||
        answer.value.length == 0)
    ) {
      const errMsg = question.constrErrorMsg;
      throw {
        message: `User error: ${
          errMsg ? errMsg.en_US : 'You need to fill in all the blanks.'
        }`,
        code: HttpStatus.BAD_REQUEST,
      } as SurveyException;
    }
  }

  async startSurvey(
    entity: string | Survey,
    examCode?: string,
    partnerId?: number,
  ) {
    let survey: Survey | null;

    if (typeof entity == 'string') {
      survey = await this.surveyRepos.findOne({
        where: {
          active: true,
          accessToken: entity,
        },
      });
    } else {
      survey = entity;
    }

    let partner: Partner | null | undefined = undefined;

    if (partnerId) {
      partner = await this.datasource.getRepository(Partner).findOne({
        where: {
          id: partnerId,
        },
      });
    }

    if (survey == null) {
      throw {
        message: 'Access token is not valid.',
        cause: entity,
        code: HttpStatus.NOT_FOUND,
      } as SurveyException;
    }

    const newInput = await this.surveyResultService.createUserInput({
      survey,
      partner,
      examCode,
    });

    return newInput;
  }

  async getSurveys(
    where: FindManyOptions<Survey>,
    page: number = 1,
    take?: number,
  ) {
    const data = await paginate(
      this.surveyRepos,
      {
        limit: take || Number(process.env['RECORD_PER_PAGE'] || 10),
        page: page && page >= 1 ? page : 1,
      },
      where,
    );

    return data;
  }

  async getSurveyInfo(where: FindOptionsWhere<Survey>) {
    return await this.surveyRepos.findOne({
      where,
      select: {
        questions: false,
      },
      loadEagerRelations: false,
    });
  }

  async getSurvey({
    accessToken,
    answerToken,
    page,
    take = 1,
  }: {
    accessToken: string;
    answerToken?: string;
    page?: number;
    take: number;
  }): Promise<
    | (Partial<Survey> &
        PaginationSurveyResult & {
          nextSection?: {
            title: string;
            tagId: number;
          };
        })
    | null
  > {
    // get survey
    take = !take || isNaN(take) || take < 1 ? 1 : take;

    const requiredSurvey = await this.surveyRepos.findOne({
      where: {
        accessToken: accessToken,
        active: true,
      },
    });

    if (requiredSurvey == null) {
      throw {
        message: 'Exam is not found.',
        cause: 'Invalid accesstoken: ',
        code: HttpStatus.NOT_FOUND,
      } as SurveyException;
    }

    // group the page:

    const pages = new Map<number, SurveyGetPageDto>();
    const pagesFromSurvey = await this.questService.getPages(
      {
        isRandomSurvey: requiredSurvey.isRandomSurvey,
        accessToken: accessToken,
        answerToken: answerToken,
      },
      {
        page: page || 1,
        limit: take,
      },
      true,
    );
    console.log('=========');

    console.log(pages);
    console.log('=========');

    for (let question of pagesFromSurvey.data) {
      const id = question.id;

      pages.set(id, {
        page: {
          questionId: id,
          description: question.description,
          title: question.title,
          audioFilename: question.audioFilename,
          deadline: question.deadline,
          limitSectionTime: question.limitSectionTime,
          tagId: question.randomTagId,
          tagName: question.randomTagName,
        },
        questions: [],
      });
    }

    const pageids = pagesFromSurvey.data.map((e) => e.id);

    const questions = await this.questService.getQuestions({
      isRandomSurvey: requiredSurvey.isRandomSurvey,
      accessToken: requiredSurvey.accessToken,
      answerToken: answerToken,
      inPages: pageids,
    });

    console.log(questions);

    questions.forEach((question) => {
      const p = pages.get(question.pageId)!;
      // suggested Answer:
      let suggestedAnswers:
        | SurveyGetAnswertDto[]
        | SurveyGetMatrixSuggestionDto;

      const cols = question.suggestedAnswers.map((answ) => {
        return {
          value: answ.value,
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
              valueImageFileName: answ.valueImageFileName,
              id: answ.id,
              sequence: answ.sequence,
            };
          }),
        };
      } else {
        suggestedAnswers =
          question.questionType == SurveyQuestionType.SINGLE_LINE_WITH_ANSWER
            ? []
            : cols;
      }
      p.questions.push(toQuestionDto(question, suggestedAnswers));
    });

    let nextSection: any = undefined;

    if (pagesFromSurvey.hasNextPage && requiredSurvey.isRandomSurvey) {
      const repos = this.datasource.getRepository(SurveyInputQuestionRel);
      try {
        const sections = await repos.find({
          where: {
            isPage: true,
            input: {
              accessToken: answerToken,
            },
          },
          take: 1,
          skip: (page ? page - 1 : 0) * take + 1,
          order: {
            sequence: 'ASC',
            id: 'ASC',
            tag: {
              id: 'ASC',
            },
          },
        });
        if (sections.length > 0) {
          nextSection = {
            title: sections[0].tag.name,
            tagId: sections[0].tag.id,
          };
        }
      } catch (err) {
        Logger.error(err);
      }
    }

    return {
      ...toSurveyDto(requiredSurvey, pagesFromSurvey, pages),
      nextSection,
    };
  }

  async saveLines(
    accessToken: string,
    answerToken: string,
    post: SurveyPostParamsDto,
    user?: any,
  ) {
    const answers = post.answers;
    if (answers == undefined) {
      throw {
        message: 'Missing answers key in body.',
        cause: post,
      } as SurveyException;
    }

    const foundInput = await this.surveyResultService.getInput(
      accessToken,
      answerToken,
    );
    this.checkInputAuthorized(foundInput.input, user);

    const currInput = foundInput.input;

    const survey = currInput.survey;
    // check the input state, if done, user cannot sumbmit his/her answers.
    this.userCanSubmit(currInput);

    // create new lines to store user answer
    const lines: SurveyUserInputLine[] = [];

    // if user submit the data after required time, skip the answer:
    const isOutOfTime: boolean = this.checkTimingOnSubmit(survey, currInput);

    const questionsInSurveyRaw = await this.questService.getQuestions({
      isRandomSurvey: survey.isRandomSurvey,
      accessToken: survey.accessToken,
      answerToken: answerToken,
    });

    const pages = (
      await this.questService.getPages({
        isRandomSurvey: survey.isRandomSurvey,
        accessToken: survey.accessToken,
        answerToken: answerToken,
      })
    ).data;

    for (let question of questionsInSurveyRaw) {
      if (!SCORABLE_TYPES.includes(question.questionType)) {
        continue;
      }
      const answer = answers.get(question.id + '');

      this.checkRequiredAnswer(question, answer);
      if (answer) {
        const savingMethod = this.savingFactory.create(question.questionType);
        const savedLines = await savingMethod.validate(
          survey,
          question,
          currInput,
          answer,
        );
        for (let i of savedLines) {
          if (isOutOfTime) {
            i.isSkipped = true;
          }
          i.questionSequence = question.sequence;
          lines.push(i);
        }
      }
    }

    return await this.datasource.manager.transaction(async (manager) => {
      const statistic = await this.surveyResultService.statistics(
        currInput,
        pages,
        questionsInSurveyRaw,
      );
      if (statistic.percentage > survey.requiredScoreMin) {
        currInput.scoringSuccess = true;
      }

      const savedData = await this.saveResult(manager, currInput, lines);
      if (survey.scoringType == SurveyScoringType.SCORE_WITH_ANSWERS) {
        return statistic;
      } else {
        return {
          submited: true,
        };
      }
    });
  }
}
