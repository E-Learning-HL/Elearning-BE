import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Between, FindManyOptions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { FileService } from '../file/file.service';
import { Section } from '../sections/entities/section.entity';
import { Lesson } from '../lessons/entities/lesson.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private readonly fileService: FileService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    course.nameCourse = createCourseDto.name;
    course.price = createCourseDto.price;
    course.introduce = createCourseDto.introduce;
    course.isActive = createCourseDto.status;
    course.start = createCourseDto.course_level[0];
    course.target = createCourseDto.course_level[1];
    course.listening = createCourseDto.listening;
    course.speaking = createCourseDto.speaking;
    course.reading = createCourseDto.reading;
    course.writing = createCourseDto.writing;

    const courseResult = await this.courseRepository.save(course);

    const fileUrl = await this.fileService.uploadBase64File(
      createCourseDto.cover[0].response,
      createCourseDto.cover[0].type,
      createCourseDto.cover[0].name,
    );

    await this.fileService.saveFile(fileUrl, courseResult.id, null, null);

    createCourseDto?.course_section?.forEach(async (item) => {
      const section = new Section();
      section.nameSection = item.section_name;
      section.course = courseResult;
      const sectionResult = await this.sectionRepository.save(section);

      item?.lessons?.forEach(async (lessonItem) => {
        const lesson = new Lesson();
        lesson.nameLesson = lessonItem.name;
        lesson.section = sectionResult;
        lesson.isActive = true;
        lesson.order = 1; // order = count(lesson + assignment) với sectionId vừa tạo

        const lessonReusult = await this.lessonRepository.save(lesson);

        const fileUrl = await this.fileService.uploadBase64File(
          lessonItem.video[0].response,
          lessonItem.video[0].type,
          lessonItem.video[0].name,
        );
        await this.fileService.saveFile(fileUrl, null, lessonReusult.id, null);
      });
    });

    return {
      status: 200,
      message: 'Create course successfully',
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
    data: Course[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<Course> = {
      order: { id: sort },
      skip: offset,
      take: limit,
      relations: ['section', 'section.lesson', 'section.lesson.file', 'file'],
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [{ nameCourse: Like(`%${keyword}%`) }];
    }

    const [courses, total] = await this.courseRepository.findAndCount(
      searchCondition,
    );

    return {
      total,
      currentPage: page,
      perpage: limit,
      data: courses,
    };
  }

  async findOne(id: number): Promise<Course | null> {
    try {
      return await this.courseRepository.findOneOrFail({
        where: {
          id: id,
        },
        relations: ['section', 'section.lesson', 'section.lesson.file', 'file'],
      });
    } catch (e) {
      throw new HttpException(
        "There's an error when get course by id",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCoursePublic(
    id: number,
    isActive: boolean,
  ): Promise<Course | null> {
    try {
      return await this.courseRepository.findOneOrFail({
        where: {
          id: id,
          isActive: isActive,
        },
        relations: ['section', 'section.lesson', 'section.lesson.file', 'file'],
      });
    } catch (e) {
      throw new HttpException(
        "There's an error when get course by id",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCourseLevel(
    startPoint: number,
    endPoint: number,
  ): Promise<Course[]> {
    const courses = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.section', 'section')
      .leftJoin('section.lesson', 'lesson')
      .where('course.start >= :startPoint', { startPoint })
      .andWhere('course.target <= :endPoint', { endPoint })
      .andWhere('course.isActive = :isActive', { isActive: true })
      .select([
        'course.id',
        'course.nameCourse',
        'course.price',
        'course.introduce',
        'course.listening',
        'course.speaking',
        'course.reading',
        'course.writing',
        'course.start',
        'course.target',
        'course.isActive',
        'COUNT(lesson.id) As countLesson', // Đếm số lượng bài học trong mỗi khóa học
      ])
      .groupBy('course.id')
      .orderBy('course.start', 'ASC')
      .getRawMany();

    if (!courses) {
      throw new NotFoundException({
        message: 'Courses not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return courses;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const courseToUpdate = await this.courseRepository.findOne({
      where: { id: id },
    });

    if (!courseToUpdate) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Update course properties if they exist in the DTO
    if (updateCourseDto.name) {
      courseToUpdate.nameCourse = updateCourseDto.name;
    }
    if (updateCourseDto.price) {
      courseToUpdate.price = updateCourseDto.price;
    }
    if (updateCourseDto.introduce) {
      courseToUpdate.introduce = updateCourseDto.introduce;
    }
    if (updateCourseDto.listening) {
      courseToUpdate.listening = updateCourseDto.listening;
    }
    if (updateCourseDto.speaking) {
      courseToUpdate.speaking = updateCourseDto.speaking;
    }
    if (updateCourseDto.reading) {
      courseToUpdate.reading = updateCourseDto.reading;
    }
    if (updateCourseDto.writing) {
      courseToUpdate.writing = updateCourseDto.writing;
    }
    if (updateCourseDto.course_level) {
      courseToUpdate.start = updateCourseDto.course_level[0];
      courseToUpdate.target = updateCourseDto.course_level[1];
    }
    if (updateCourseDto.status !== undefined) {
      courseToUpdate.isActive = updateCourseDto.status;
    }

    // Save the updated course to the database
    const updatedCourse = await this.courseRepository.save(courseToUpdate);

    return updatedCourse;
  }

  async remove(id: number) {
    return await this.courseRepository.delete(id);
  }
}
