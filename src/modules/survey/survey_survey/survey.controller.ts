import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Roles } from 'src/modules/roles/roles.decorator';
import { PermissionMode } from 'src/modules/ir/ir.model.access/enum/permission.enum';
import {
  Survey,
  selectBaseSurveyOptions,
} from './entities/survey_survey.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/auth/auth/strategies/jwt.strategy';
import { RolesGuard } from 'src/modules/roles/guards/roles.guard';
import { SurveyGetReturnDto } from '../utils/dtos/survey_get_params.dto';
import {
  SurveyPostParamsDto,
  bodyExample,
} from '../utils/dtos/survey_post_params.dto';
import { SurveyUserInput } from '../survey_user_input/entities/survey_user_input.entity';

import { SurveyUserInputService } from '../survey_user_input/survey_user_input.service';
import { SurveyState } from './enums/survey_state.enum';
import {
  SurveyException,
  SurveyExceptionCode,
} from './exceptions/survey.exception';
import { FindOptionsWhere, In } from 'typeorm';
import {
  SurveyGetDtoOptions,
  SurveyMeGetOptionsDto,
} from './dtos/survey_get.dto';
import { RedisService } from 'src/modules/redis/redis.service';
import {
  RedisQuestionInputAudio,
  RedisUserAnswer,
  RedisUserInputAudio,
} from './types/redist_input.type';
import { from } from 'rxjs';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';
import { error } from 'console';
import { SurveyQuestionService } from '../survey_question/survey_question.service';
import { SCORABLE_TYPES } from './types/scorable_type.const';
import { SurveySkillService } from '../survey_skill/survey_skill.service';
import { SurveyQuestion } from '../survey_question/entities/survey_question.entity';
import { SizeLimitInterceptor } from 'src/utils/interceptors/sizelimit.interceptor';
import { SurveyQuestionType } from '../survey_question/enums/question_type.enum';

@Controller({
  path: 'survey',
  version: '1',
})
@ApiTags('Exams/Surveys')
@ApiBearerAuth()
export class SurveyController {
  constructor(
    @Inject('SurveyService') private service: SurveyService,
    private inputService: SurveyUserInputService,
    protected readonly questService: SurveyQuestionService,
    private redis: RedisService,
    private surveySkillService: SurveySkillService,
  ) {}

  private async tryGettingInprogressSurvey(surveys: any[], user?: any) {
    const email = user ? user.email : undefined;

    try {
      if (email) {
        for (let survey of surveys) {
          const inprogressSurveyKey = await this.redis.get(
            `${email}_${survey.accessToken}`,
          );
          if (inprogressSurveyKey) {
            const hasInDb = await this.inputService.has(
              inprogressSurveyKey as string,
            );
            if (hasInDb) {
              survey.answerToken = inprogressSurveyKey;
            } else {
              this.redis.del(`${email}_${survey.accessToken}`);
            }
          }
        }
      }
    } catch (err) {
      Logger.error(err);
    }
    return surveys;
  }

  private async checkSurveyValidity(survey: Survey | null, user: any) {
    // check survey exsitence.
    if (survey == null) {
      throw new NotFoundException({
        message: 'Survey is not found',
      });
    }

    // check survey auth.
    if (survey.requireLogin && !user) {
      throw new UnauthorizedException({
        message: 'This survey requires login.',
      });
    }

    return survey;
  }
  private async checkSurveyCodeValidity(
    survey: Survey,
    codeName: string | undefined,
  ) {
    const codes = await survey.possibleExamCode;
    if (codes.length == 0) {
      return true;
    }
    if (!codeName) {
      throw {
        message: 'This survey requires a valid code.',
        cause: codeName + ' is missing',
        code: HttpStatus.BAD_REQUEST,
        scode: SurveyExceptionCode.INVALID_EXAMCODE,
      } as SurveyException;
    }
    for (let code of codes) {
      if (code.name.en_US.toLocaleLowerCase() == codeName.toLocaleLowerCase()) {
        const now = new Date();

        if (code.startValidDatetime) {
          code.startValidDatetime.setHours(
            code.startValidDatetime.getHours() + 7,
          );
        }

        if (code.endValidDatetime) {
          code.endValidDatetime.setHours(code.endValidDatetime.getHours() + 7);
        }

        if (
          code.startValidDatetime &&
          now.getTime() < code.startValidDatetime.getTime()
        ) {
          throw {
            message: 'This exam has not been started yet.',
            cause: codeName + ' is not started',

            code: HttpStatus.BAD_REQUEST,
            scode: SurveyExceptionCode.INVALID_EXAMCODE,
          } as SurveyException;
        }

        if (
          code.endValidDatetime &&
          now.getTime() > code.endValidDatetime.getTime()
        ) {
          throw {
            message: 'Exam code is expired',
            cause: codeName + ' is expired',
            code: HttpStatus.BAD_REQUEST,
            scode: SurveyExceptionCode.INVALID_EXAMCODE,
          } as SurveyException;
        }
        return true;
      }
    }
    throw {
      message: 'This survey requires a valid code.',
      cause: codeName + ' is missing',
      code: HttpStatus.BAD_REQUEST,
      scode: SurveyExceptionCode.INVALID_EXAMCODE,
    } as SurveyException;
  }
  @Get('me')
  @Roles({
    mode: PermissionMode.READ,
    model: Survey,
    acceptPublic: false,
  })
  @ApiQuery({
    type: SurveyMeGetOptionsDto,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async getUserSurveys(@Req() request: any, @Query() { tags, page }: any) {
    const user = request.user!;

    try {
      tags = this.parseTags(tags);
      const data = await this.service.getSurveys(
        {
          ...selectBaseSurveyOptions({
            surveyInputs: {
              partner: {
                id: user.partnerId,
              },
            },
            tags: {
              id: tags ? In(tags) : undefined,
            },
          }),
        },
        page,
      );
      data.data = await this.tryGettingInprogressSurvey(data.data, user);

      return data;
    } catch (err) {
      // just in case
      throw new BadRequestException({
        message: err,
      });
    }
  }

  private parseTags(tags: any) {
    if (tags) {
      if (typeof tags == 'string') {
        return [Number(tags)];
      } else {
        return tags.map((e) => Number(e));
      }
    }
    return undefined;
  }

  private async getQuestionLimitAudioFromDb(
    qid: number,
    accessToken: string,
    answerToken: string,
  ) {
    const query = `
          select a.id as questionId, b.id as surveyId,
          c.start_datetime as starttime,
          d.input_id, b.is_time_limited as sistimelimited, b.time_limit as stimelimit, 
          c.access_token as answer_token, b.access_token, limit_listening_times as limittimes
          from survey_question a
          left join survey_user_input_question_rel d
          on a.id = d.question_id
          left join survey_user_input c
          on d.input_id = c.id
          left join survey_survey b
          on c.survey_id = b.id or a.survey_id = b.id
          where a.id = $1 and (b.access_token = $2 and c.access_token = $3)
          `;

    let data = await this.inputService.getByQuery(query, [
      qid,
      accessToken,
      answerToken,
    ]);

    if (data && data.length > 0) {
      data = data[0];

      return {
        startTime: new Date(data.starttime),
        isTimeLimit: data.sistimelimited,
        limitTime: data.stimelimit,
        data: {
          qid: qid,
          limits: data.limittimes,
        },
      };
    }
    throw {
      message: 'Bad request.',
      cause: 'Payload is not valid.',
    };
  }

  @Get('count/:accessToken/:answerToken:/:id/audio')
  async increaseAudioCount(
    @Param('id') id: number,
    @Param('accessToken') accessToken: string,
    @Param('answerToken') answerToken: string,
  ) {
    // const input = await this.inputService.getInput(accessToken, answerToken);

    try {
      // try to get from the redis first:

      let fromRedis = (await this.redis.get(answerToken)) as RedisUserAnswer;

      if (!fromRedis) {
        throw {
          message: 'Redis Error: Redis local was not be initialized properly.',
          cause: `Empty object for ${answerToken} exam.`,
        } as SurveyException;
      }

      if (!fromRedis.audio[id]) {
        const formDatabase = await this.getQuestionLimitAudioFromDb(
          id,
          accessToken,
          answerToken,
        );
        // store to redis
        fromRedis.audio[id] = {
          limits: formDatabase.data.limits,
          requests: 1,
          currentAudioTime: 0,
        };
        try {
          this.redis.update(answerToken, fromRedis);
        } catch (e) {
          Logger.error(e);
        }
      } else {
        const oldQuestionvalue = fromRedis.audio[id] as RedisQuestionInputAudio;
        const limits = oldQuestionvalue.limits;
        let currRequest = oldQuestionvalue.requests || 1;
        let currAudioTime = oldQuestionvalue.currentAudioTime;

        if (currRequest >= limits) {
          throw {
            message: 'Bad request.',
            cause: 'Request limits exceeded.',
          };
        }

        fromRedis.audio[id] = {
          limits,
          requests: currRequest + 1,
          currentAudioTime: currAudioTime,
        };

        this.redis.update(answerToken, fromRedis);
      }

      return fromRedis.audio;
      // save to redis
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('all')
  @ApiQuery({
    type: SurveyGetDtoOptions,
  })
  @Roles({
    mode: PermissionMode.READ,
    model: Survey,
    acceptPublic: true,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async getSurveys(@Query() { random, page, tags }: any, @Req() request: any) {
    try {
      const user = request.user;

      if (random && random > 3) {
        throw 'Random number must be less than three!';
      }

      tags = this.parseTags(tags);

      const options = selectBaseSurveyOptions({
        tags: {
          id: tags ? In(tags) : undefined,
        },
      });

      let data: PaginationResultType<Survey>;
      if (!random || random <= 0) {
        data = await this.service.getSurveys(options, page);
      } else {
        data = await this.service.getSurveys(
          {
            ...options,
            where: {
              ...options.where,
              isInvisible: true,
            },
          },
          page,
        );
        const total = data.totalRecord;

        if (total <= random) {
          return data;
        }

        const randomData: Survey[] = [];
        const setRandom = new Set<Number>();
        while (setRandom.size < random) {
          const temp = Math.floor(Math.random() * total);
          setRandom.add(temp);
        }

        for (let i of setRandom) {
          randomData.push(data.data[Number(i)]);
        }
        data.data = randomData;
        data.totalRecord = Number(random);
        data.hasNextPage = false;
      }
      data.data = await this.tryGettingInprogressSurvey(data.data, user);

      return data;
    } catch (err) {
      Logger.error(err);

      throw new BadRequestException({
        message: err,
      });
    }
  }
  @Get('me/latest')
  @Roles({
    mode: PermissionMode.READ,
    model: SurveyUserInput,
    acceptPublic: false,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async getLatestUserInput(@Req() request: any) {
    const user = request.user!;
    if (!user.partnerId || !user.id) {
      throw new UnauthorizedException();
    }
    try {
      const data = await this.inputService.getLatestInput(user);
      return data;
    } catch (err) {
      Logger.error(err);
      // just in case
      throw new BadRequestException({
        message: err,
      });
    }
  }
  @Get('me/:accessToken')
  @Roles({
    mode: PermissionMode.READ,
    model: SurveyUserInput,
    acceptPublic: false,
  })
  @UseGuards(JwtGuard, RolesGuard)
  @ApiQuery({
    type: SurveyMeGetOptionsDto,
  })
  async getUserInputs(
    @Req() request: any,
    @Param('accessToken') accessToken: string,
    @Query() { page }: any,
  ) {
    const user = request.user!;
    if (!user.partnerId || !user.id) {
      throw new UnauthorizedException();
    }
    try {
      const data = await this.inputService.getUserInputs(
        user.partnerId,
        accessToken,
        page,
      );
      return data;
    } catch (err) {
      // just in case
      throw new BadRequestException({
        message: err,
      });
    }
  }

  @Get('questions/:accessToken/:answerToken')
  @Roles({
    mode: PermissionMode.READ,
    model: Survey,
    acceptPublic: true,
  })
  @UseGuards(JwtGuard, RolesGuard)
  @ApiResponse({
    type: SurveyGetReturnDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
  })
  @ApiQuery({
    name: 'take',
    required: false,
  })
  async getSurvey(
    @Req() request,
    @Param('accessToken') accessToken: string,
    @Param('answerToken') answerToken: string,
    @Query('page') page: number = 1,
    @Query('take') take: number = 1,
  ) {
    try {
      const user = request.user;
      // check survey existing
      const trySurvey = await this.service.getSurveyInfo({
        active: true,
        accessToken: accessToken,
      });
      // if this survey is required login or not?
      const authorizedSurvey = await this.checkSurveyValidity(trySurvey, user);

      const { input, survey } = await this.inputService.getInput(
        accessToken,
        answerToken,
      );

      if (input.state == SurveyState.DONE || input.state == SurveyState.NEW) {
        throw {
          message:
            input.state == SurveyState.DONE
              ? 'This exam is closed.'
              : 'This exam has not been started yet.',
          code: HttpStatus.FORBIDDEN,
          scode:
            input.state == SurveyState.DONE
              ? SurveyExceptionCode.CLOSED
              : SurveyExceptionCode.NOT_STARTED,
        } as SurveyException;
      }
      if (survey.isTimeLimited) {
        const startTime = input.startDatetime.getTime();
        const currentTime = new Date().getTime();

        const extraTime = Number(process.env['DEFAULT_EXTRA_LIMIT_TIME']) || 3; // minutes
        if (
          startTime + (survey.timeLimit + extraTime) * 60 * 1000 <=
          currentTime
        ) {
          throw {
            message: 'This exam has ended due to exceeding the time limit.',
            code: HttpStatus.BAD_REQUEST,
            scode: SurveyExceptionCode.TOKEN_EXPIRED,
          } as SurveyException;
        }
      }
      const result = await this.service.getSurvey({
        accessToken: accessToken,
        answerToken: answerToken,
        page: page <= 1 ? 1 : page,
        take,
      });

      return result;
    } catch (err: any) {
      throw new HttpException(err, err.code);
    }
  }

  @Patch('/start/:token')
  @Roles({
    mode: PermissionMode.WRITE,
    model: SurveyUserInput,
    acceptPublic: true,
  })
  @ApiQuery({
    name: 'code',
    required: false,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async startSurvey(
    @Param('token') token: string,
    @Req() request,
    @Query('code') examCode?: string,
  ): Promise<Partial<SurveyGetReturnDto>> {
    try {
      const user = request.user;
      const trySurvey = await this.service.getSurveyInfo({
        active: true,
        accessToken: token,
      });
      const authorizedSurvey = await this.checkSurveyValidity(trySurvey, user);

      await this.checkSurveyCodeValidity(authorizedSurvey, examCode);
      const { survey, input } = await this.service.startSurvey(
        authorizedSurvey,
        examCode,
        user ? user.partnerId : undefined,
      );

      if (user && user.email) {
        this.redis.set(
          `${user.email}_${token}`,
          input.accessToken,
          survey.isTimeLimited && survey.timeLimit > 0
            ? survey.timeLimit * 60
            : undefined,
        );
      }

      return {
        accessToken: survey.accessToken,
        answerToken: input.accessToken,
        timeLimit: survey.timeLimit,
        isTimeLimited: survey.isTimeLimited,
        timeLSLimit: survey.timeLimitLs,
        state: input.state,
        title: survey.title,
      };
    } catch (err) {
      throw new HttpException(err, err.code);
    }
  }

  @Patch('/begin/:token/:answerToken')
  @Roles({
    mode: PermissionMode.WRITE,
    model: SurveyUserInput,
    acceptPublic: true,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async beginSurvey(
    @Param('token') token: string,
    @Param('answerToken') answerToken: string,
    @Req() request: any,
  ): Promise<Partial<SurveyGetReturnDto>> {
    try {
      const user = request.user;
      const trySurvey = await this.service.getSurveyInfo({
        active: true,
        accessToken: token,
      });

      const authorizedSurvey = await this.checkSurveyValidity(trySurvey, user);

      const { survey, input, partner, attemptsLeft } =
        await this.service.startExisting(token, answerToken, user);

      // init redis storage:

      let ttl = Number(process.env['REDIS_TTL'] || 5 * 60 * 60);

      if (survey.isTimeLimited) {
        ttl =
          survey.timeLimit * 60 +
          Number(process.env['DEFAULT_EXTRA_LIMIT_TIME'] || 3) * 60;
      }
      const redisData: RedisUserAnswer | undefined = await this.redis.get(
        answerToken,
      );

      let rawPages: SurveyQuestion[] = (
        await this.questService.getPages(
          {
            isRandomSurvey: survey.isRandomSurvey,
            accessToken: survey.accessToken,
            answerToken: answerToken,
          },
          {
            page: 1,
            limit: 100000,
          },
        )
      ).data;
      let pages = {};

      let index = 0;

      for (let page of rawPages) {
        const _data = {
          title: page.title,
          questions: {},
          sequence: page.sequence,
        };

        pages[page.id] = _data;

        let rawQuestions: SurveyQuestion[] =
          await this.questService.getQuestions({
            isRandomSurvey: survey.isRandomSurvey,
            accessToken: survey.accessToken,
            answerToken: answerToken,
            inPages: [page.id],
          });

        for (let q of rawQuestions.filter((_q) => {
          return SCORABLE_TYPES.includes(_q.questionType);
        })) {
          let defaultValue: any = '';

          if (
            [
              SurveyQuestionType.MULTIPLE_CHOICE,
              SurveyQuestionType.SIMPLE_CHOICE,
              SurveyQuestionType.SELECT,
            ].includes(q.questionType) ||
            (q.questionType == SurveyQuestionType.SIMPLE_CHOICE &&
              q.isCorrectingQuestion)
          ) {
            defaultValue = [];
          }

          const value =
            redisData && redisData[q.id] && redisData[q.id].value
              ? redisData[q.id].value
              : defaultValue;

          console.log({
            questionType: q.questionType,
            defaultValue: value,
          });

          pages[q.pageId].questions[q.id] = {
            value: value,
            label: q.label || index + 1,
            sequence: q.sequence,
          };
          index++;
        }
      }

      if (!redisData) {
        this.redis.set(
          answerToken,
          {
            answers: {
              accessToken: token,
              answerToken: answerToken,
              answers: {},
            },
            audio: {},
          } as RedisUserAnswer,
          ttl,
        );
      }

      return {
        updatedAt: survey.updatedAt,
        accessToken: survey.accessToken,
        answerToken: input.accessToken,
        timeLimit: survey.timeLimit,
        isTimeLimited: survey.isTimeLimited,
        startDateTime: input.startDatetime,
        timeLSLimit: survey.timeLimitLs,
        attemptsLeft: attemptsLeft,
        state: input.state,
        partnerId: partner?.id,
        isRandomSurvey: survey.isRandomSurvey,
        title: survey.title,
        userAnswerData: redisData,
        descriptionDone: survey.descriptionDone,
        initialData: pages,
        scoringType: survey.scoringType,
      };
    } catch (err) {
      throw new HttpException(err, err.code ?? 400);
    }
  }

  @Post('/submit/:token/:answerToken')
  @UseInterceptors(new SizeLimitInterceptor(1024 * 1024 * 50))
  @ApiBody({
    description: `
    Loại multiple choice sửa lỗi sai: value có dạng: [{id: 'id answer', value : 'correct value form user'}]
    `,
    schema: {
      example: bodyExample,
    },
    type: SurveyPostParamsDto,
  })
  @Roles({
    mode: PermissionMode.WRITE,
    model: SurveyUserInput,
    acceptPublic: true,
  })
  @UseGuards(JwtGuard, RolesGuard)
  async submitSurvey(
    @Param('token') token: string,
    @Param('answerToken') answerToken: string,
    @Body() post: any,
    @Req() request: any,
  ) {
    try {
      // convert answer to a map:
      if (post.answers) {
        post.answers = new Map(Object.entries(post.answers));
      }
      const savedData = await this.service.saveLines(
        token,
        answerToken,
        post,
        request.user,
      );

      this.redis.del(answerToken);
      const user = request.user;
      if (user && user.email) {
        this.redis.del(`${user.email}_${token}`);
      }
      return savedData;
    } catch (err) {
      Logger.error(err);
      throw new HttpException(err, 400);
    }
  }

  @Post('/update/:answertoken')
  @UseInterceptors(new SizeLimitInterceptor(1024 * 1024 * 50))
  async updateLocalAnswer(
    @Param('answertoken') answerToken: string,
    @Body('data') data: any,
  ) {
    try {
      let warning: undefined | string = undefined;
      if (data && data.answers) {
        const answers = data.answers.answers;
        const audio: {
          [x: number]: any;
        } = data.audio;

        const fromRedis = (await this.redis.get(
          answerToken,
        )) as RedisUserAnswer;

        if (fromRedis && audio) {
          for (let entry of Object.entries(audio)) {
            fromRedis.audio[Number(entry[0])].currentAudioTime =
              entry[1].currentAudioTime;
          }
        }

        fromRedis.answers = answers;
        this.redis.update(answerToken, fromRedis);
      } else {
        warning = 'No answers found!';
      }

      return {
        message: `Saved changes to ${answerToken} exam.`,
        warning,
      };
    } catch (err) {
      Logger.error('=========ERROR WHEN BACKUP LOCAL DATA TO USER==========');
      Logger.error(err);
      Logger.error('=========END ERROR==========');
    }
  }
}
