import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { SurveySkill, SurveySkillRel } from './entities/survey_skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyQuestionService } from '../survey_question/survey_question.service';
import { FindSkillOptions } from './types/survey_skill.type';
import { SurveyQuestion } from '../survey_question/entities/survey_question.entity';
import { SurveyException } from '../survey_survey/exceptions/survey.exception';
import { toInOperator } from 'src/utils/transformers/to_in_operator';

@Injectable()
export class SurveySkillService {
  constructor(
    private datasource: DataSource,
    @InjectRepository(SurveySkill)
    private surveySkillRepos: Repository<SurveySkill>,
    @InjectRepository(SurveySkillRel)
    private surveySkillRelRepos: Repository<SurveySkillRel>,
    private questionService: SurveyQuestionService,
  ) {}

  async randomizeQuestions({
    numberOfQuestions,
    skillId,
    typeOfQuestionId,
    exclude,
  }: FindSkillOptions) {
    const repos = this.datasource.getRepository(SurveyQuestion);

    let randomQuestions = await repos
      .createQueryBuilder('q')
      .where(
        `q.id in ( select question_ids from survey_skill_rel where skill_ids = :skill) and type_of_question = :type ${
          exclude && exclude.length > 0
            ? ' and q.id not in ' + toInOperator(exclude)
            : ''
        } and q.is_in_question_bank`,
        {
          skill: skillId,
          type: typeOfQuestionId,
        },
      )
      .select(['q.id'])
      .orderBy('RANDOM()')
      .take(numberOfQuestions)
      .getMany();
    return {
      // page: undefined,
      questions: await this.datasource.getRepository(SurveyQuestion).find({
        where: {
          id: In(randomQuestions.map((e) => e.id)),
        },
        relations: {
          suggestedAnswers: true,
          maxtrixSuggestedAnswers: true,
        },
      }),
    };
  }
}
