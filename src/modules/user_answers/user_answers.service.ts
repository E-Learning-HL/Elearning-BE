import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';
import { UserAnswer } from './entities/user_answer.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Score } from '../scores/entities/score.entity';
import { QUESTION_TYPE } from '../questions/constants/question-type.enum';
import { Answer } from 'src/modules/answers/entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { Question } from '../questions/entities/question.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class UserAnswersService {
  constructor(
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async create(userId : number , createUserAnswerDto: CreateUserAnswerDto) {
    console.log('createUserAnswerDto', createUserAnswerDto,userId )
    createUserAnswerDto.question.forEach( question => {
      if (Array.isArray(question.answer) && question.answer.length > 0) {
      question.answer.forEach(async answer => {
        const userAnswer = new UserAnswer()
        const oldUser = await this.usersRepository.findOne({where : {id : userId}})
        if(oldUser){
          userAnswer.user = oldUser
        }

        const oldQuestion = await this.questionRepository.findOne({where : {id :question.questionId}})
        if(oldQuestion){
          userAnswer.question = oldQuestion
        }

        const oldAnswer = await this.answerRepository.findOne({where : {id :answer.answerId}})
        if(oldAnswer){
          userAnswer.answer =  oldAnswer
        }

        const oldTask = await this.taskRepository.findOne({where : {id :createUserAnswerDto.taskId}})
        if(oldTask){
          userAnswer.task=  oldTask
        }
        if (answer.answerText !== undefined){
          userAnswer.answerText = answer.answerText
        }
        const userAnswerResult = await this.userAnswerRepository.save(userAnswer)
        console.log('userAnswerResult', userAnswerResult)
      });
    }
    });

    // Tính điểm từ các đáp án và lưu điểm vào cơ sở dữ liệu
    const score = await this.calculateAndSaveScore(userId, createUserAnswerDto);
    
    return { score, message: 'Your test has been graded successfully.' };
  }

  private async calculateAndSaveScore(userId: number, createUserAnswerDto: CreateUserAnswerDto): Promise<number> {
    // Tính điểm từ các đáp án
    const score = await this.calculateScore(createUserAnswerDto);
    
    // Lưu điểm vào cơ sở dữ liệu
    await this.saveScore(userId, createUserAnswerDto.taskId, score);

    return score;
  }

  private async calculateScore(createUserAnswerDto: CreateUserAnswerDto): Promise<number> {
    let totalScore = 0;

    for (const question of createUserAnswerDto.question) {
      if (Array.isArray(question.answer) && question.answer.length > 0) {
        const answerIds = question.answer.map(answer => answer.answerId);
        switch (question.questionType) {
          case QUESTION_TYPE.SIMPLE_CHOICE:
            totalScore += await this.calculateSimpleChoiceScore(answerIds);
            break;
          case QUESTION_TYPE.MULTIPLE_CHOICE:
            if (await this.isMultipleChoiceCorrect(question.questionId, answerIds)) {
              totalScore += 1;
            }
            break;
          case QUESTION_TYPE.INPUT:
            if (await this.isInputCorrect(question.questionId, question.answer[0]?.answerText)) {
              totalScore += 1;
            }
            break;
          default:
            break;
        }
      }
    }

    // Nhân điểm cho 10
    return totalScore * 10;
  }

  private async isMultipleChoiceCorrect(questionId: number, answerIds: number[]): Promise<boolean> {
    const correctAnswers = await this.answerRepository.find({
      where: {
        question: { id: questionId },
        id: In(answerIds),
        isCorrect: true,
      },
    });
    return correctAnswers.length === answerIds.length;
  }

  private async isInputCorrect(questionId: number, answerText: string): Promise<boolean> {
    const correctAnswer = await this.answerRepository.findOne({
      where: {
        question: { id: questionId },
        content: answerText,
        isCorrect: true,
      },
    });
    return !!correctAnswer;
  }

  private async calculateSimpleChoiceScore(answerIds: number[]): Promise<number> {
    const correctAnswerId = answerIds[0];
    const correctAnswer = await this.answerRepository.findOne({where :{id :correctAnswerId}});
    if (!correctAnswer){
      throw new HttpException('No  found  Answer ', HttpStatus.NOT_FOUND);
    }
    return correctAnswer.isCorrect ? 1 : 0;
  }
  

  private async saveScore(userId: number, taskId: number, score: number): Promise<void> {
    const newScore = new Score()
    newScore.score = score
    newScore.task.id = taskId
    newScore.user.id = userId
    await this.scoreRepository.save(newScore);
  }
  

  findAll() {
    return `This action returns all userAnswers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAnswer`;
  }

  update(id: number, updateUserAnswerDto: UpdateUserAnswerDto) {
    return `This action updates a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
