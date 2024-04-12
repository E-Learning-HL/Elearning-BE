import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { Enrolment } from './entities/enrolment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { use } from 'passport';
import { ASSIGNINMENT_TYPE } from '../assignments/constants/assignment-type.enum';

@Injectable()
export class EnrolmentsService {
  constructor(
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
  ) {}

  create(createEnrolmentDto: CreateEnrolmentDto) {
    return 'This action adds a new enrolment';
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
    data: Enrolment[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<Enrolment> = {
      order: { id: sort },
      skip: offset,
      take: limit,
      relations: ['user', 'course'],
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [
        {
          course: {
            nameCourse: Like(`%${keyword}%`),
          },
        },
      ];
    }

    const [enrolments, total] = await this.enrolmentRepository.findAndCount(
      searchCondition,
    );

    return {
      total,
      currentPage: page,
      perpage: limit,
      data: enrolments,
    };
  }

  async findCourse(id: number) : Promise<any> {
    const options: FindManyOptions<Enrolment> = {
      where: {
        user: { id: id },
        course: { isActive: true },
        isActive : true
      },
      relations: ['course', 'course.file'],
    };

    const courses = await this.enrolmentRepository.find(options);

    if (!courses.length) {
      throw new NotFoundException('Bạn chưa đăng ký khóa học nào.');
    }

    return courses;
  }

  async findOneCourse(id: number, courseId : number) : Promise<any> {
    try {
      const course = await this.enrolmentRepository.findOne({
        where: {
          user: { id: id },
        course: { isActive: true, id : courseId },
        isActive : true
          
        },
        relations: [
          'course', 
          'course.file',
          'course.section',
          'course.section.lesson',
          'course.section.assignment',
          'course.section.lesson.file',
        ],
      });
      if (!course) {
        throw new NotFoundException({
          message: 'Courses not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      const lessonsAndAssignments: Array<{
        type: string;
        order: number;
        item: any;
      }> = [];

      course.course.section.forEach((section) => {
        // Thêm các bài học vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...section.lesson.map((lesson) => ({
            type: 'lesson',
            order: lesson.order,
            item: lesson,
          })),
        );

        // Thêm các bài tập có isActive = true vào mảng lessonsAndAssignments
        const activeAssignments = section.assignment.filter(
          (assignment) =>
            assignment.isActive === true &&
            assignment.assignmentType === ASSIGNINMENT_TYPE.EXERCISES,
        );

        // Thêm các bài tập vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...activeAssignments.map((assignment) => ({
            type: 'assignment',
            order: assignment.order,
            item: assignment,
          })),
        );
      });

      // Sắp xếp mảng lessonsAndAssignments theo biến order
      lessonsAndAssignments.sort((a, b) => a.order - b.order);

      // Đếm số lượng bài học
      let lessonCount = 0;
      course.course.section.forEach((section) => {
        lessonCount += section.lesson.length;
      });

      return {
        ...course,
        lessonCount: lessonCount,
        section: lessonsAndAssignments,
      };
    } catch (e) {
      throw new HttpException(`Course is not found`, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: number, updateEnrolmentDto: UpdateEnrolmentDto) {
    const enrolment = await this.enrolmentRepository.findOne({
      where: { id: id },
    });
    if (!enrolment) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Enrolment not found',
      });
    }
    enrolment.isActive = updateEnrolmentDto.status;
    await this.enrolmentRepository.save(enrolment);
    return {
      status: HttpStatus.OK,
      message: `Update enrolment ${id} successfully `,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} enrolment`;
  }
}
