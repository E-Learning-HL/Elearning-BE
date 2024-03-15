import { BaseEntity } from 'src/database/base/base.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SurveyUserInput } from './survey_user_input.entity';
import { SurveyQuestion } from '../../survey_question/entities/survey_question.entity';
import {
  SCORE_IN_QUESTIONS,
  SCORE_IN_SUGGESTIONS,
  SurveyQuestionType,
} from '../../survey_question/enums/question_type.enum';
import { SurveyTag } from '../../survey_tag/entities/survey_tag.entity';
import { Logger } from '@nestjs/common';
import { SurveySkillRel } from '../../survey_skill/entities/survey_skill.entity';

@Entity('survey_user_input_question_rel')
export class SurveyInputQuestionRel extends BaseEntity {
  @ManyToOne(() => SurveyUserInput)
  @JoinColumn({
    name: 'input_id',
  })
  input: SurveyUserInput;

  @ManyToOne(() => SurveyQuestion, {
    eager: true,
    persistence: false,
  })
  @JoinColumn({
    name: 'question_id',
  })
  question: SurveyQuestion;

  @Column({ name: 'question_title', type: 'text' })
  title: any;

  @Column({ name: 'correct_answer' })
  correctAnswer: string;

  @Column({ name: 'score', type: 'double precision' })
  score: number;

  @Column({ name: 'label' })
  label: string;

  @Column({ name: 'sequence' })
  sequence: number;

  @Column({ name: 'is_page' })
  isPage: boolean;

  @Column({ name: 'page_id' })
  pageId: number;

  @ManyToOne(() => SurveyTag, {
    eager: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: SurveyTag;

  @Column({
    name: 'start_date',
    type: 'time without time zone',
  })
  startDate: Date;

  @ManyToOne(() => SurveySkillRel, (e) => e.id, {
    eager: true,
  })
  @JoinColumn({
    name: 'skill_rel_id',
  })
  skillRel: SurveySkillRel;
  @AfterLoad()
  getQuestions() {
    if (!this.isPage) {
      if (SCORE_IN_QUESTIONS.includes(this.question.questionType)) {
        this.question.answerScore = this.score;
      } else if (SCORE_IN_SUGGESTIONS.includes(this.question.questionType)) {
        if (this.question.suggestedAnswers) {
          let totalCorrect = 0;

          for (var i of this.question.suggestedAnswers) {
            if (i.isCorrect) {
              totalCorrect += 1;
            }
          }

          for (var i of this.question.suggestedAnswers) {
            if (i.isCorrect) {
              if (totalCorrect <= 0) {
                i.answerScore = 0;
              } else {
                i.answerScore = this.score / totalCorrect;
              }
            }
          }
        }
      }
      this.question.pageId = this.pageId;
    } else {
      const page = new SurveyQuestion();
      page.id = this.id;
      page.tag = this.tag;
      if (this.tag) {
        page.title = this.tag.name || 'Page';
      }
      this.question = page;
    }
    try {
      this.question.sequence = this.sequence;
    } catch (err) {
      this.question.sequence = 10;
    }
  }
}
