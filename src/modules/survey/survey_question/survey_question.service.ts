import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyQuestion } from './entities/survey_question.entity';
import {
  FindOneOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { paginate } from 'src/utils/pagination';
import { QuestionOptions } from './types/get_question_option.type';
import {
  SurveyGetAnswertDto,
  SurveyGetMatrixSuggestionDto,
} from '../utils/dtos/survey_get_params.dto';
import { SurveyQuestionType } from './enums/question_type.enum';
import { toQuestionDto } from '../survey_survey/utils/filter_data';
import { SurveyInputQuestionRel } from '../survey_user_input/entities/survey_user_input_question.entity';
import { read } from 'fs';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';
import { resolve } from 'path';
import { take } from 'rxjs';

@Injectable()
export class SurveyQuestionService {
  constructor(
    @InjectRepository(SurveyQuestion)
    private readonly surveyQuestionRepos: Repository<SurveyQuestion>,
    @InjectRepository(SurveyInputQuestionRel)
    readonly surveyInputQuestionRepos: Repository<SurveyInputQuestionRel>,
  ) {}
  async getPages(
    options: QuestionOptions,
    paginationOptions: IPaginationOptions = {
      limit: 10000000,
      page: 1,
    },
    startCountingTime: boolean = false,
    // ids?: number[],
  ) {
    if (options.isRandomSurvey) {
      const data = await paginate(
        this.surveyInputQuestionRepos,
        paginationOptions,
        {
          where: {
            isPage: true,
            input: {
              accessToken: options.answerToken,
            },
            id: options.ids ? In(options.ids) : undefined,
          },
          order: {
            sequence: 'ASC',
            id: 'ASC',
            tag: {
              id: 'ASC',
            },
          },
        },
      );

      const questions: SurveyQuestion[] = [];

      for (const e of data.data) {
        try {
          try {
            e.question.randomTagId = e.tag.id;
            e.question.randomTagName = e.tag.name;
            Logger.debug(e.tag);
          } catch (e) {
            Logger.error(e);
          }
          questions.push(e.question);
          if (startCountingTime) {
            const tagId = e.tag.id;
            const newSection: SurveyInputQuestionRel[] = [];
            const startedSection = await this.surveyInputQuestionRepos.find({
              where: {
                tag: {
                  id: tagId,
                },
                isPage: true,
                input: {
                  accessToken: options.answerToken,
                },
              },
            });

            if (startedSection) {
              let startDate: undefined | Date = undefined;
              for (let i of startedSection) {
                if (i.startDate) {
                  startDate = i.startDate;
                  break;
                }
              }

              if (startDate == undefined) {
                startDate = new Date();
              }

              for (let i of startedSection) {
                if (!i.startDate) {
                  i.startDate = startDate;
                  newSection.push(i);
                }
              }

              for (let i of newSection) {
                await this.surveyInputQuestionRepos.update(i.id, {
                  startDate: startDate,
                });
              }

              startDate.setMinutes(
                startDate.getMinutes() + e.skillRel.limitSectionTime,
              );

              e.question.deadline = startDate;
              if (e.skillRel.limitSectionTime > 0) {
                e.question.limitSectionTime = e.skillRel.limitSectionTime;
              } else {
                e.question.limitSectionTime = undefined;
              }
            }
          }
        } catch (err) {
          console.log('====HIHI');

          Logger.error(err);
        }
      }

      const returned: Promise<PaginationResultType<SurveyQuestion>> =
        new Promise((resolve) => {
          resolve({
            currentPage: data.currentPage,
            data: questions,
            hasNextPage: data.hasNextPage,
            totalRecord: data.totalRecord,
          });
        });

      return await returned;
    } else {
      return await paginate(this.surveyQuestionRepos, paginationOptions, {
        where: {
          isPage: true,
          id: options.ids ? In(options.ids) : undefined,
          survey: {
            accessToken: options.accessToken,
          },
        },
        order: {
          sequence: 'ASC',
        },
      });
    }
  }

  async getQuestions(options: QuestionOptions) {
    if (options.isRandomSurvey) {
      const data = (
        await this.surveyInputQuestionRepos.find({
          where: {
            isPage: In([undefined, false]),
            input: {
              accessToken: options.answerToken,
            },
            pageId: options.inPages ? In(options.inPages) : undefined,
          },
          order: {
            pageId: 'ASC',
            sequence: 'ASC',
          },
        })
      ).map((e) => e.question);

      return data;
    } else {
      return await this.surveyQuestionRepos.find({
        where: {
          survey: {
            accessToken: options.accessToken,
          },
          isPage: In([undefined, false]),
          pageId: options.inPages ? In(options.inPages) : undefined,
          id: options.ids ? In(options.ids) : undefined,
        },
        order: {
          sequence: 'ASC',
          id: 'ASC',
        },

        relations: {
          maxtrixSuggestedAnswers: true,
        },
      });
    }
  }

  async getQuestion(options: FindOptionsWhere<SurveyQuestion>) {
    return await this.surveyQuestionRepos.findOne({
      where: options,
      relations: {
        suggestedAnswers: true,
        maxtrixSuggestedAnswers: true,
      },
      order: {
        sequence: 'ASC',
      },
    });
  }
}
