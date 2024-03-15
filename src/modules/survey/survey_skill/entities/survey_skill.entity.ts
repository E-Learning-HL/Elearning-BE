import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import { Survey } from '../../survey_survey/entities/survey_survey.entity';
import { BaseEntity } from 'src/database/base/base.entity';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';

@Entity('survey_skills')
export class SurveySkill extends BaseEntity {
  @Column({
    name: 'title',
  })
  title: string;

  @Column({
    name: 'description',
  })
  description: string;

  @ManyToMany(() => SurveyQuestion)
  @JoinTable({
    name: 'survey_skill_rel',
    joinColumn: {
      name: 'skill_ids',
    },
    inverseJoinColumn: {
      name: 'question_ids',
    },
  })
  questions: Promise<SurveyQuestion[]>;
}

@Entity('survey_survey_skill_rel')
export class SurveySkillRel extends BaseEntity {
  @ManyToOne(() => Survey)
  @JoinColumn({
    name: 'survey_id',
  })
  survey: Promise<Survey>;

  @ManyToOne(() => SurveySkill, {
    eager: true,
  })
  @JoinColumn({
    name: 'skill_id',
  })
  skill: SurveySkill;

  @ManyToOne(() => SurveyTag, {
    eager: true,
  })
  @JoinColumn({
    name: 'type_of_question',
  })
  typeOfQuestion: SurveyTag;

  @Column({
    name: 'nbr_of_question',
  })
  nbrOfQuestion: number;

  @Column({
    name: 'max_score',
  })
  maxScore: number;

  @ManyToOne(() => SurveyTag, {
    eager: true,
  })
  @JoinColumn({
    name: 'tag_id',
  })
  tag: SurveyTag;

  @Column({
    name: 'time_for_skill',
  })
  limitSectionTime: number;

  @Column({
    name: 'sequence',
  })
  sequence: number;
}
