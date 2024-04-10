import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { logger } from 'handlebars';
import { FileEntity } from '../file/entities/file.entity';

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
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
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
      const countOrder = await this.assignmentRepository.findAndCount({
        where: { course: { id: course.id } },
      });
      assignment.order = countOrder[1] + 1 ?? 0;
    }

    if (createAssignmentDto.section_id !== undefined) {
      const section = new Section();
      section.id = createAssignmentDto.section_id;
      assignment.section = section;
      const countOrder = await this.assignmentRepository.findAndCount({
        where: { section: { id: section.id } },
      });
      assignment.order = countOrder[1] + 1 ?? 0;
    }

    const assignmentResult = await this.assignmentRepository.save(assignment);
    console.log('createAssignmentDto.task', createAssignmentDto.task);

    for (const taskDto of createAssignmentDto.task) {
      console.log('taskDto', taskDto);

      const task = new Task();
      task.content = taskDto.content;
      task.assignment = assignmentResult;
      task.taskType = taskDto.task_type;

      const taskResult = await this.taskRepository.save(task);

      if (taskDto.task_type == TASK_TYPE.LISTENING) {
        const audioUrl = await this.fileService.uploadBase64File(
          taskDto.audio[0].response,
          taskDto.audio[0].type,
          taskDto.audio[0].name,
        );

        await this.fileService.saveFile(audioUrl, null, null, taskResult.id);
      }

      for (const questionDto of taskDto.question) {
        console.log('questionDto', questionDto);
        const question = new Question();
        question.title = questionDto.title;
        question.task = taskResult;
        question.questionType = questionDto.question_type;

        const questionResult = await this.questionRepository.save(question);

        for (const answerDto of questionDto.answer) {
          console.log('answerDto', answerDto);
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

  async update(
    id: number,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<any> {
    const oldAssignment = await this.assignmentRepository.findOne({
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
    console.log('course : ', oldAssignment);

    if (!oldAssignment) {
      throw new NotFoundException('Assignment not found');
    }

    oldAssignment.nameAssignment = updateAssignmentDto.name;
    oldAssignment.isActive = updateAssignmentDto.status;

    await this.assignmentRepository.save(oldAssignment);

    const updateTask = updateAssignmentDto.task;
    // check old task voi new task
    if (updateTask) {
      const oldTask = oldAssignment.task.map((itemTask) => itemTask.id);

      const newTask = updateAssignmentDto.task.map(
        (itemTask) => itemTask.taskId,
      );

      const taskToDelete = oldTask.filter(
        (itemTask) => !newTask.includes(itemTask),
      );

      // xoa di nhung old task khong co trong new task
      for (const taskId of taskToDelete) {
        const questionToDelete = await this.questionRepository.find({
          where: { task: { id: taskId } },
        });

        if (updateTask[0].task_type == TASK_TYPE.LISTENING) {
          const fileToDelete = await this.fileRepository.find({
            where: { task: { id: taskId } },
          });
          for (const fileId of fileToDelete) {
            await this.fileRepository.delete(fileId.id);
          }
        }

        // xoa question
        for (const question of questionToDelete) {
          const answerToDelete = await this.answerRepository.find({
            where: { question: { id: question.id } },
          });
          // xoa answer
          for (const answer of answerToDelete) {
            await this.answerRepository.delete(answer.id);
          }

          await this.questionRepository.delete(question.id);
        }
        await this.taskRepository.delete(taskId);
      }

      updateTask.map(async (itemTask) => {
        if (!itemTask.taskId) {
          // co task moi
          const task = new Task();
          task.taskType = itemTask.task_type;
          if (itemTask.content !== undefined) {
            task.content = itemTask.content;
          }

          const taskResult = await this.taskRepository.save(task);
          if (itemTask.audio !== undefined) {
            const audioUrl = await this.fileService.uploadBase64File(
              itemTask.audio[0].response,
              itemTask.audio[0].type,
              itemTask.audio[0].name,
            );

            await this.fileService.saveFile(
              audioUrl,
              null,
              null,
              taskResult.id,
            );
          }

          for (const questionDto of itemTask.question) {
            const question = new Question();
            question.title = questionDto.title;
            question.task = taskResult;
            question.questionType = questionDto.question_type;

            const questionResult = await this.questionRepository.save(question);

            for (const answerDto of questionDto.answer) {
              const answer = new Answer();
              answer.content = answerDto.title;
              answer.question = questionResult;
              answer.isCorrect = answerDto.is_correct;

              await this.answerRepository.save(answer);
            }
          }
        } else {
          // khong co task moi
          if (itemTask.audio !== undefined) {
            if (!itemTask.audio[0]?.fileId) {
              // co file audio moi
              const oldFile = await this.fileRepository.find({
                where: { task: { id: itemTask.taskId } },
              });
              for (const file of oldFile) {
                await this.fileService.deleteFile(file.id);
              }
              const audioUrl = await this.fileService.uploadBase64File(
                itemTask.audio[0].response,
                itemTask.audio[0].type,
                itemTask.audio[0].name,
              );

              await this.fileService.saveFile(
                audioUrl,
                null,
                null,
                itemTask.taskId,
              );
            }
          }

          const task = await this.taskRepository.findOne({
            where: { id: itemTask.taskId },
          });
          if (!task) {
            throw new NotFoundException('task not found');
          }
          task.content = itemTask.content;
          const taskResult = await this.taskRepository.save(task);

          // Lấy các câu hỏi của task
          const oldQuestions = oldAssignment.task.find(
            (item) => item.id == itemTask.taskId,
          )?.question;
          // Lấy các ID của câu hỏi mới
          const newQuestions = itemTask.question.map((item) => item.questionId);

          const questionToDelete = oldQuestions?.filter(
            (itemQuestion) => !newQuestions.includes(itemQuestion.id),
          );
          if (questionToDelete) {
            for (const question of questionToDelete) {
              const answerToDelete = await this.answerRepository.find({
                where: { question: { id: question.id } },
              });
              // xoa answer
              for (const answer of answerToDelete) {
                await this.answerRepository.delete(answer.id);
              }
              await this.questionRepository.delete(question.id);
            }
          }

          for (const questionDto of itemTask.question) {
            if (questionDto.questionId) {
              // không có question mới
              const question = await this.questionRepository.findOne({
                where: { id: questionDto.questionId },
              });
              if (question) {
                question.title = questionDto.title;
                await this.questionRepository.save(question);
              }

              for (const answerDto of questionDto.answer) {
                if (answerDto.answerId) {
                  // không có answer mới
                  const answer = await this.answerRepository.findOne({
                    where: { id: answerDto.answerId },
                  });
                  if (answer) {
                    answer.content = answerDto.title;
                    answer.isCorrect = answerDto.is_correct;
                    await this.questionRepository.save(answer);
                  }
                } else {
                  // có answer mới
                  const answer = new Answer();
                  answer.content = answerDto.title;
                  answer.isCorrect = answerDto.is_correct;
                }
              }
            } else {
              // có question mới
              const question = new Question();
              question.title = questionDto.title;
              question.task = taskResult;
              question.questionType = questionDto.question_type;

              const questionResult = await this.questionRepository.save(
                question,
              );

              for (const answerDto of questionDto.answer) {
                const answer = new Answer();
                answer.content = answerDto.title;
                answer.question = questionResult;
                answer.isCorrect = answerDto.is_correct;

                await this.answerRepository.save(answer);
              }
            }
          }
        }
      });
    }
  }

  async remove(id: number): Promise<string> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: id },
      relations: ['task'],
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    if (assignment.task && assignment.task.length > 0) {
      await Promise.all(
        assignment.task.map(async (task) => {
          await this.taskRepository.remove(task);
        }),
      );
    }
    await this.assignmentRepository.remove(assignment);
    return `Assignment by ${id}  deleted successfully`;
  }
}
