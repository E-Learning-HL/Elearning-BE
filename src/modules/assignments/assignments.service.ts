import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Task } from '../tasks/entities/task.entity';
import { Question } from '../questions/entities/question.entity';
import { Answer } from '../answers/entities/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { TASK_TYPE } from '../tasks/constants/task-type.enum';
import { Course } from '../courses/entities/course.entity';
import { Section } from '../sections/entities/section.entity';
import { QUESTION_TYPE } from '../questions/constants/question-type.enum';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private readonly fileService: FileService,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const assignment = new Assignment();
    assignment.nameAssignment = createAssignmentDto.name;
    assignment.isActive = createAssignmentDto.status;
    assignment.assignmentType = createAssignmentDto.exam_type;

    if (createAssignmentDto.course_id !== undefined) {
      const course = new Course();
      course.id = createAssignmentDto.course_id;
      assignment.course = course;
    }

    if (createAssignmentDto.section_id !== undefined) {
      const section = new Section();
      section.id = createAssignmentDto.section_id;
      assignment.section = section;
    }

    const assignmentResult = await this.assignmentRepository.save(assignment);

    for (const taskDto of createAssignmentDto.task) {
      const task = new Task();
      task.content = taskDto.content;
      task.assignment = assignmentResult;
      task.taskType = taskDto.task_type;

      const taskResult = await this.taskRepository.save(task);

      const audioUrl = await this.fileService.uploadBase64File(
        taskDto.audio[0].response,
        taskDto.audio[0].type,
        taskDto.audio[0].name,
      );

      await this.fileService.saveFile(audioUrl, null, null, taskResult.id);

      for (const questionDto of taskDto.question) {
        const question = new Question();
        question.title = questionDto.title;
        question.task = taskResult;
        const countIsCorrect = questionDto.answer.filter(
          (questionDto) => questionDto.is_correct == true,
        ).length;
        question.questionType =
          countIsCorrect > 1
            ? QUESTION_TYPE.MULTIPLE_CHOICE
            : QUESTION_TYPE.SIMPLE_CHOICE;

        const questionResult = await this.questionRepository.save(question);

        for (const answerDto of questionDto.answer) {
          const answer = new Answer();
          answer.content = answerDto.title;
          answer.question = questionResult;
          answer.isCorrect = answerDto.is_correct;

          await this.answerRepository.save(answer);
        }
      }
    }

    return {
      status: 200,
      message: 'Create assignment successfully',
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{
    total: number;
    currentPage: number;
    perpage: number;
    data: Assignment[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<Assignment> = {
      order: { id: sort },
      skip: offset,
      take: limit,
      relations: [
        'task',
        'task.question',
        'task.question.answer',
        'task.file',
        'course',
        'section',
      ],
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [{ nameAssignment: Like(`%${keyword}%`) }];
    }

    const [assignments, total] = await this.assignmentRepository.findAndCount(
      searchCondition,
    );

    return {
      total,
      currentPage: page,
      perpage: limit,
      data: assignments,
    };
  }

  async findOne(id: number): Promise<Assignment | null> {
    try {
      return await this.assignmentRepository.findOneOrFail({
        where: { id: id },
        relations: [
          'task',
          'task.question',
          'task.question.answer',
          'task.file',
          'course',
          'section',
        ],
      });
    } catch (e) {
      throw new HttpException(
        "There's an error when get assignment by id",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} exam`;
  }

  remove(id: number) {
    return `This action removes a #${id} exam`;
  }
}
