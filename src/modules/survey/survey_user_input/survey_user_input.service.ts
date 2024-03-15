import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyUserInput } from './entities/survey_user_input.entity';
import {
  DataSource,
  EntityManager,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { SurveyUserInputLineService } from '../survey_user_input_line/survey_user_input_line.service';
import { Survey } from '../survey_survey/entities/survey_survey.entity';
import { Partner } from 'src/modules/res/res.partner/entities/partner.entity';
import { SurveyState } from '../survey_survey/enums/survey_state.enum';
import crypto from 'crypto';
import { SurveyValidity } from '../survey_survey/enums/survey_validity.enum';
import {
  SurveyException,
  SurveyExceptionCode,
} from '../survey_survey/exceptions/survey.exception';
import { SurveyQuestion } from '../survey_question/entities/survey_question.entity';
import { paginate } from 'src/utils/pagination';
import {
  SCORE_IN_QUESTIONS,
  SCORE_IN_SUGGESTIONS,
  SurveyQuestionType,
} from '../survey_question/enums/question_type.enum';
import { SCORABLE_TYPES } from '../survey_survey/types/scorable_type.const';
import { SurveyTag } from '../survey_tag/entities/survey_tag.entity';
import { SurveyUserInputLine } from '../survey_user_input_line/entities/survey_user_input_line.entity';
import { SurveyUserInputTagResult } from '../survey_tag_result/entities/survey_tag_result.entity';
import { SurveySkillService } from '../survey_skill/survey_skill.service';
import { SurveyQuestionAnswer } from '../survey_question_answer/entities/survey_question_answer.entity';
import { SurveyService } from '../survey_survey/survey.service';
import { SurveyQuestionService } from '../survey_question/survey_question.service';
import { SurveySkillRel } from '../survey_skill/entities/survey_skill.entity';
import { SurveyInputQuestionRel } from './entities/survey_user_input_question.entity';
import { logger } from 'handlebars';
@Injectable()
export class SurveyUserInputService {
  constructor(
    @InjectRepository(SurveyUserInput)
    private readonly repos: Repository<SurveyUserInput>,
    private readonly lineService: SurveyUserInputLineService,
    private readonly datasource: DataSource,
    protected readonly surveySkillService: SurveySkillService,
    protected readonly questionService: SurveyQuestionService,
  ) {}

  async save(input: SurveyUserInput[]) {
    return await this.repos.save(input, {
      transaction: true,
    });
  }

  async getLatestInput(user: any) {
    const input = await this.repos.findOne({
      where: {
        partner: user.partnerId,
        state: SurveyState.DONE,
        endDatetime: Not(IsNull()),
      },
      relations: {
        lines: true,
        survey: true,
        questionsRel: true,
      },
      order: {
        endDatetime: 'DESC',
        id: 'DESC',
      },
    });
    const userInputResult = {
      correct: 0,
      incorrect: 0,
      percentage: 0,
      isPassed: false,
      scoringTotal: 0,
      totalQuestions: 0,
      unanswer: 0,
    };
    if (input == null) {
      throw {
        code: HttpStatus.NOT_FOUND,
        cause: 'Cannot get any data',
        message: 'No data found.',
      } as SurveyException;
    }

    if (input.survey) {
      if (input.survey.isRandomSurvey && input.questionsRel) {
        userInputResult.totalQuestions = input.questionsRel.filter((q) => {
          try {
            return SCORABLE_TYPES.includes(q.question.questionType);
          } catch (e) {
            return false;
          }
        }).length;
      } else {
        userInputResult.totalQuestions = input.survey.numberOfQuestions || 0;
      }
    }

    for (const line of input.lines) {
      if (line.answerIsCorrect) {
        userInputResult.correct += 1;
      } else {
        userInputResult.incorrect += 1;
      }
    }
    userInputResult.percentage = input.scoringPercentage;
    userInputResult.isPassed = input.scoringSuccess || false;
    userInputResult.scoringTotal = input.scoringTotal;
    const unanswer =
      userInputResult.totalQuestions -
      (userInputResult.correct + userInputResult.incorrect);
    userInputResult.unanswer = unanswer >= 0 ? unanswer : 0;
    return userInputResult;
  }

  async has(answerToken: string) {
    const x = await this.repos.findOne({
      where: {
        accessToken: answerToken,
      },
      select: {
        id: true,
      },
      loadEagerRelations: false,
    });
    if (x == null) {
      return false;
    }
    return true;
  }

  getBuilder() {
    return this.repos.createQueryBuilder();
  }

  getByQuery(query: string, params?: any) {
    return this.repos.query(query, params);
  }

  private async generateRandomQuestions(accessToken: string) {
    const survey = await this.datasource.getRepository(Survey).findOne({
      where: { accessToken: accessToken },
    });

    if (!survey) {
      throw {
        message: 'No survey found.',
        code: HttpStatus.NOT_FOUND,
        cause: `${accessToken} does not exist.`,
      } as SurveyException;
    }

    const configs = await survey.skillConfigs;

    const data: {
      config: SurveySkillRel;
      // page: SurveyQuestion;
      questions: SurveyQuestion[];
    }[] = [];

    let generatedIds: number[] = [];
    for (const config of configs) {
      const generatedQuestions =
        await this.surveySkillService.randomizeQuestions({
          numberOfQuestions: config.nbrOfQuestion,
          skillId: config.skill.id,
          typeOfQuestionId: config.typeOfQuestion.id,
          exclude: generatedIds,
        });

      generatedIds = generatedIds.concat(
        generatedQuestions.questions.map((e) => e.id),
      );

      data.push({
        config: config,
        ...generatedQuestions,
      });
    }

    return data;
  }

  private async createRandomPage({
    manager,
    input,
    skillRel,
  }: {
    manager: EntityManager;
    input: SurveyUserInput;
    skillRel: SurveySkillRel;
  }) {
    const newInputQuestionPage = new SurveyInputQuestionRel();
    // newInputQuestionPage.question = undefined;
    newInputQuestionPage.isPage = true;
    newInputQuestionPage.sequence = skillRel.sequence;
    newInputQuestionPage.input = input;
    newInputQuestionPage.tag = skillRel.tag;
    newInputQuestionPage.skillRel = skillRel;
    // const savedPage = newInputQuestionPage;
    const savedPage = await manager.save(newInputQuestionPage);
    return savedPage;
  }

  private createRandomQuestion({
    sequence,
    input,
    question,
    pageId, // score,
  }: {
    sequence: number;
    input: SurveyUserInput;
    question: SurveyQuestion;
    pageId: number;
    // score: number;
  }) {
    const newInputQuestion = new SurveyInputQuestionRel();
    newInputQuestion.isPage = false;
    newInputQuestion.question = question;
    newInputQuestion.title = question.timeLimit;
    newInputQuestion.label = question.label;
    newInputQuestion.pageId = pageId;
    // newInputQuestion.score = score;
    newInputQuestion.sequence = sequence;
    newInputQuestion.input = input;
    return newInputQuestion;
  }

  private async generateRandomData(
    manager: EntityManager,
    data: {
      config: SurveySkillRel;
      questions: SurveyQuestion[];
    },
    input: SurveyUserInput,
    pages: SurveyInputQuestionRel[],
    questions: SurveyInputQuestionRel[],
    sequence: number,
  ) {
    // console.log('=========');

    // const scorableQuestions = data.questions.filter((q) => {
    //   return SCORABLE_TYPES.includes(q.questionType);
    // });

    // let score = data.config.maxScore / scorableQuestions.length;
    // if (isNaN(score) || !score) {
    //   score = 0;
    // }

    // console.log(data.questions.length);
    // console.log(scorableQuestions.length);
    // console.log(data.config.maxScore);
    // console.log(score);

    let hasCreatePage = false;
    let pageId = 0;

    for (let question of data.questions) {
      if (question.isPage) {
        const questionInSavedPage = await this.questionService.getQuestions({
          isRandomSurvey: false,
          inPages: [question.id],
        });
        const newConfig = Object.assign({}, data.config);
        // newConfig.maxScore = score;

        await this.generateRandomData(
          manager,
          {
            config: newConfig,
            questions: questionInSavedPage,
          },
          input,
          pages,
          questions,
          sequence++,
        );
      } else {
        if (!hasCreatePage) {
          let savedPage = await this.createRandomPage({
            input: input,
            manager,
            skillRel: data.config,
          });
          pages.push(savedPage);
          pageId = savedPage.id;
          hasCreatePage = true;
        }
        const newInputQuestion = this.createRandomQuestion({
          input: input,
          question: question,
          sequence: sequence++,
          pageId: pageId,
        });

        questions.push(newInputQuestion);
      }
    }
  }

  /**
   * Create a new user input for a survey
   * If user is loggin, the created input belongs to that user.
   */
  async createUserInput(options: {
    survey: Survey;
    partner?: Partner | null;
    examCode?: string;
  }) {
    const { survey, partner, examCode } = options;

    let newInput = new SurveyUserInput();
    newInput.accessToken = crypto.randomUUID();
    newInput.survey = survey;
    let attemptsDone: undefined | number = undefined;
    if (partner) {
      if (survey.isAttemptsLimited) {
        const hasDone = await this.countInputs(survey.accessToken, partner);
        attemptsDone = hasDone;
        const attemptLimit = survey.attemptsLimit;
        if (hasDone >= attemptLimit) {
          throw {
            message: 'Attempts limit is reached for this user.',
            code: HttpStatus.FORBIDDEN,
          } as SurveyException;
        }
      }
      newInput.partner = partner;
      newInput.email = partner.email;
      newInput.nickname = partner.name;
    }
    newInput.state = SurveyState.NEW;
    newInput.examCode = examCode ? examCode.toUpperCase() : '';

    // handel random question:
    const manager = this.datasource.manager;
    let sequence = 0;
    await manager.transaction(async (entityManager) => {
      if (survey.isRandomSurvey) {
        const randomData = await this.generateRandomQuestions(
          survey.accessToken,
        );
        const inputQuestions: SurveyInputQuestionRel[] = [];
        const inputQuestionPages: SurveyInputQuestionRel[] = [];

        for (var row of randomData) {
          sequence = sequence + 1;
          const questionEachRow: SurveyInputQuestionRel[] = [];
          const pageEachRow: SurveyInputQuestionRel[] = [];
          await this.generateRandomData(
            manager,
            row,
            newInput,
            pageEachRow,
            questionEachRow,
            sequence,
          );

          const filteredQuestions = questionEachRow.filter((q) => {
            return SCORABLE_TYPES.includes(q.question.questionType);
          });

          let score = 0;
          try {
            score = row.config.maxScore / filteredQuestions.length;
            if (isNaN(score) || !score) {
              score = 0;
            }
            for (const q of filteredQuestions) {
              q.score = score;
            }
          } catch (err) {
            score = 0;
            Logger.error(err);
          }

          inputQuestions.push(...questionEachRow);
          inputQuestionPages.push(...pageEachRow);
        }
        await manager.save(inputQuestions);

        newInput.questionsRel = inputQuestions.concat(inputQuestionPages);
      }
      newInput = await entityManager.save(newInput);
    });

    return {
      input: newInput,
      attemptsLeft:
        survey.isAttemptsLimited && attemptsDone
          ? survey.attemptsLimit - attemptsDone - 1
          : undefined,
      survey: survey,
      partner: partner,
    };
  }

  async getUserInputs(partnerId: number, accessToken?: string, page?: number) {
    return paginate(
      this.repos,
      {
        page: page ?? 1,
        limit: Number(process.env['RECORD_PER_PAGE'] || 10),
      },
      {
        where: {
          survey: {
            accessToken: accessToken,
            active: true,
          },
          partner: {
            id: partnerId,
          },
        },
        select: {
          id: true,
          accessToken: true,
          state: true,
          createdAt: true,
          nickname: true,
          email: true,
          startDatetime: true,
          endDatetime: true,
          startExtraExam: true,
          endExtraExam: true,
          isFullTest: true,
        },
        order: {
          id: 'DESC',
        },
      },
    );
  }

  async countInputs(accessToken: string, partner: Partner) {
    return await this.repos.count({
      where: {
        partner: {
          id: partner.id,
        },
        survey: {
          accessToken: accessToken,
        },
      },
    });
  }

  async getInput(accessToken: string, answerToken: string) {
    const input = await this.repos.findOne({
      where: {
        survey: {
          accessToken: accessToken,
          active: true,
        },
        accessToken: answerToken,
      },
      relations: {
        survey: true,
        partner: true,
        lines: true,
      },
    });

    if (input == null) {
      throw {
        message: 'Tokens are not valid.',
        code: 400,
        scode: SurveyExceptionCode.INVALID_ANSWERTOKEN,
      } as SurveyException;
    }
    let remain: number | undefined = undefined;
    if (input.partner) {
      const hasDone = await this.countInputs(accessToken, input.partner);
      if (input.survey.isAttemptsLimited) {
        remain = input.survey.attemptsLimit - hasDone;
      }
    }
    return {
      survey: input.survey,
      input: input,
      attemptsLeft: remain,
      partner: input.partner,
      userAnswer: input.lines,
    };
  }

  async statistics(
    input: SurveyUserInput,
    pages: SurveyQuestion[],
    questions: SurveyQuestion[],
  ) {
    const statisticObj = {
      correct: 0,
      unanswer: 0,
      incorrect: 0,
      skipped: 0,
      total: 0,
      percentage: 0,
      detail: {},
      maxTotalScore: 0,
    };

    // const questions = await this.questionService.getQuestions({});

    try {
      const countCorrectPerTag = new Map<
        number,
        { name: any; total: number; tag: SurveyTag }
      >();

      // const pages = questions.filter((question) => question.isPage);

      const pageButInMap: {
        [key: number]: SurveyQuestion;
      } = {};

      for (let page of pages) {
        pageButInMap[page.id] = page;
      }

      const linesInPage = new Map<SurveyTag, SurveyUserInputLine[]>();
      for (let line of input.lines) {
        const page = pageButInMap[line.question.pageId];

        const tag = page.tag;

        const temp = linesInPage.get(tag);
        if (!temp) {
          linesInPage.set(tag, [line]);
        } else {
          temp.push(line);
        }
        if (line.answerIsCorrect) {
          statisticObj.correct += 1;
        } else {
          statisticObj.incorrect += 1;
        }
        if (line.isSkipped) {
          statisticObj.skipped += 1;
        }
        let qdetail = statisticObj.detail[line.question.id];
        if (!qdetail) {
          qdetail = {
            label: line.question.label,
            correct: line.answerIsCorrect,
            userAnswer: [],
          };
        }
        try {
          qdetail.userAnswer.push(
            line.valueOnlyText ||
              line.valueCharBox ||
              line.valueNumericalBox ||
              line.valueDate ||
              line.valueDatetime ||
              line.valueTextBox ||
              line.userAnswer.value.en_US,
          );
          statisticObj.detail[line.question.id] = qdetail;
        } catch (err) {
          statisticObj.detail[line.question.id] = qdetail;
        }
      }

      for (let tag of linesInPage.entries()) {
        let key = tag[0];
        if (key && key.id) {
          if (!countCorrectPerTag.has(key.id)) {
            countCorrectPerTag.set(key.id, {
              name: key.name,
              total: 0,
              tag: key,
            });
          }
          const result = countCorrectPerTag.get(key.id);
          for (let i of tag[1]) {
            if (i.answerIsCorrect) {
              result!.total += 1;
            }
          }
        }
      }

      // get total score

      const total = (
        await this.questionService.getQuestions({
          isRandomSurvey: input.survey.isRandomSurvey,
          accessToken: input.survey.accessToken,
          answerToken: input.accessToken,
        })
      ).reduce((pre, curr) => {
        if (SCORE_IN_QUESTIONS.includes(curr.questionType)) {
          pre += curr.answerScore;
        } else if (SCORE_IN_SUGGESTIONS.includes(curr.questionType)) {
          for (var i of curr.suggestedAnswers) {
            if (i.isCorrect) {
              pre += i.answerScore;
            }
          }
        }
        return pre;
      }, 0);

      const maxScore = total;

      statisticObj.maxTotalScore = maxScore;

      // get total question

      statisticObj.total = questions.filter((e) =>
        SCORABLE_TYPES.includes(e.questionType),
      ).length;

      statisticObj.unanswer = statisticObj.total - input.lines.length;
      try {
        input.scoringPercentage =
          maxScore == 0 ? 0 : (input.scoringTotal / maxScore) * 100;
        if (Number.isNaN(input.scoringPercentage)) {
          input.scoringPercentage = 0;
        }
        statisticObj.percentage = input.scoringPercentage;
      } catch (err) {
        input.scoringPercentage = 0;
      }

      const tagResults: SurveyUserInputTagResult[] = [];

      for (let tr of countCorrectPerTag.entries()) {
        const tagResult = new SurveyUserInputTagResult();
        tagResult.tag = tr[1].tag;
        tagResult.input = input;
        tagResult.tagName = tr[1].name.en_US;

        tagResult.total = tr[1].total;
        tagResult.createUser = input.createUser;
        tagResults.push(tagResult);
      }

      input.tagResults = tagResults;
    } catch (err) {
      Logger.error('<==============================>');
      Logger.error('Error when saving: ' + input.accessToken + ', Reason: ');
      Logger.error(err);
      Logger.error('<==============================>');
    }
    return statisticObj;
  }
}
