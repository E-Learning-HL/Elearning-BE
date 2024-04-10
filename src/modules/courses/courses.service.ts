import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Between, FindManyOptions, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { FileService } from '../file/file.service';
import { Section } from '../sections/entities/section.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { FileEntity } from '../file/entities/file.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private readonly fileService: FileService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = new Course();
    const [start, target] = createCourseDto.course_level
      .split('-')
      ?.map((value) => parseInt(value));
    course.nameCourse = createCourseDto.name;
    course.price = createCourseDto.price;
    course.introduce = createCourseDto.introduce;
    course.isActive = createCourseDto.status;
    course.start = start;
    course.target = target;
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

      // item?.lessons?.forEach(async (lessonItem) => {
      //   const lesson = new Lesson();
      //   lesson.nameLesson = lessonItem.name;
      //   lesson.section = sectionResult;
      //   lesson.isActive = true;
      //   lesson.order = 1; // order = count(lesson + assignment) với sectionId vừa tạo

      //   const lessonReusult = await this.lessonRepository.save(lesson);

      //   const fileUrl = await this.fileService.uploadBase64File(
      //     lessonItem.video[0].response,
      //     lessonItem.video[0].type,
      //     lessonItem.video[0].name,
      //   );
      //   await this.fileService.saveFile(fileUrl, null, lessonReusult.id, null);
      // });
      const lessons = item?.lessons || [];
      for (let i = 0; i < lessons.length; i++) {
        const lessonItem = lessons[i];
        const lesson = new Lesson();
        lesson.nameLesson = lessonItem.name;
        lesson.section = sectionResult;
        lesson.isActive = true;
        lesson.order = i + 1; // Tăng dần giá trị order theo số lượng lesson trong section

        const lessonResult = await this.lessonRepository.save(lesson);

        const fileUrl = await this.fileService.uploadBase64File(
          lessonItem.video[0].response,
          lessonItem.video[0].type,
          lessonItem.video[0].name,
        );
        await this.fileService.saveFile(fileUrl, null, lessonResult.id, null);
      }
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
      relations: [
        'section',
        'section.lesson',
        'section.assignment',
        'section.lesson.file',
        'file',
      ],
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

  async findOne(id: number): Promise<any> {
    try {
      const course = await this.courseRepository.findOneOrFail({
        where: { id: id },
        relations: [
          'section',
          'section.lesson',
          'section.assignment',
          'section.lesson.file',
          'file',
        ],
      });

      const lessonsAndAssignments: Array<{
        type: string;
        order: number;
        item: any;
      }> = [];

      course.section.forEach((section) => {
        // Thêm các bài học vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...section.lesson.map((lesson) => ({
            type: 'lesson',
            order: lesson.order,
            item: lesson,
          })),
        );

        // Thêm các bài tập vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...section.assignment.map((assignment) => ({
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
      course.section.forEach((section) => {
        lessonCount += section.lesson.length;
      });

      return {
        ...course,
        lessonCount: lessonCount,
        lessonsAndAssignments: lessonsAndAssignments,
      };
    } catch (e) {
      throw new HttpException(
        `There's an error when get course by id ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCoursePublic(id: number, isActive: boolean): Promise<any> {
    try {
      const course = await this.courseRepository.findOneOrFail({
        where: {
          id: id,
          isActive: isActive,
        },
        relations: [
          'section',
          'section.lesson',
          'section.assignment',
          'section.lesson.file',
          'file',
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

      course.section.forEach((section) => {
        // Thêm các bài học vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...section.lesson.map((lesson) => ({
            type: 'lesson',
            order: lesson.order,
            item: lesson,
          })),
        );

        // Thêm các bài tập vào mảng lessonsAndAssignments
        lessonsAndAssignments.push(
          ...section.assignment.map((assignment) => ({
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
      course.section.forEach((section) => {
        lessonCount += section.lesson.length;
      });

      return {
        ...course,
        lessonCount: lessonCount,
        lessonsAndAssignments: lessonsAndAssignments,
      };
    } catch (e) {
      throw new HttpException(`Course is not found`, HttpStatus.NOT_FOUND);
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
      .addGroupBy('lesson.order')
      .orderBy('course.start', 'ASC')
      .addOrderBy('lesson.order', 'ASC')
      .getRawMany();

    if (!courses) {
      throw new NotFoundException({
        message: 'Courses not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return courses;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<any> {
    const oldCourse = await this.courseRepository.findOne({
      where: { id: id },
      relations: ['section', 'section.lesson', 'section.lesson.file', 'file'],
    });

    console.log('course : ', oldCourse);

    if (!oldCourse) {
      throw new NotFoundException('Course not found');
    }

    // console.log('updateCourseDto : ', updateCourseDto);
    // Cập nhật thông tin của course
    if (updateCourseDto.name !== undefined) {
      oldCourse.nameCourse = updateCourseDto?.name;
    }
    if (updateCourseDto.price !== undefined) {
      oldCourse.price = updateCourseDto.price;
    }
    if (updateCourseDto.introduce !== undefined) {
      oldCourse.introduce = updateCourseDto.introduce;
    }
    if (updateCourseDto.listening !== undefined) {
      oldCourse.listening = updateCourseDto.listening;
    }
    if (updateCourseDto.speaking !== undefined) {
      oldCourse.speaking = updateCourseDto.speaking;
    }
    if (updateCourseDto.reading !== undefined) {
      oldCourse.reading = updateCourseDto.reading;
    }
    if (updateCourseDto.writing !== undefined) {
      oldCourse.writing = updateCourseDto.writing;
    }
    if (updateCourseDto.course_level !== undefined) {
      const [start, target] = updateCourseDto.course_level
        .split('-')
        ?.map((value) => parseInt(value));
      oldCourse.start = start;
      oldCourse.target = target;
    }
    if (updateCourseDto.status !== undefined) {
      oldCourse.isActive = updateCourseDto.status;
    }

    const course = await this.courseRepository.save(oldCourse);
    // Cập nhật cover của course
    const updatedCover = updateCourseDto.cover?.[0];
    if (updatedCover && !updatedCover?.fileId) {
      const oldFile = await this.fileRepository.findOne({
        where: { course: { id: oldCourse.id } },
      });
      if (oldFile) {
        await this.fileService.deleteFile(oldFile?.id);

        const fileUrl = await this.fileService.uploadBase64File(
          updatedCover.response,
          updatedCover.type,
          updatedCover.name,
        );
        await this.fileService.saveFile(fileUrl, id, null, null);
      } else {
        const fileUrl = await this.fileService.uploadBase64File(
          updatedCover.response,
          updatedCover.type,
          updatedCover.name,
        );
        await this.fileService.saveFile(fileUrl, id, null, null);
      }
    }

    // check oldSection với newSection
    if (updateCourseDto.course_section) {
      const oldSectionId = oldCourse?.section?.map(
        (itemOldSection) => itemOldSection.id,
      );

      const newSectionId = updateCourseDto?.course_section?.map(
        (itemNewSection) => itemNewSection.sectionId,
      );

      const sectionToDelete = oldSectionId.filter(
        (item) => !newSectionId.includes(item),
      );

      for (const sectionId of sectionToDelete) {
        const lessonsToDelete = await this.lessonRepository.find({
          where: { section: { id: sectionId } },
        });

        for (const lesson of lessonsToDelete) {
          const filesToDelete = await this.fileRepository.find({
            where: { lesson: { id: lesson.id } },
          });

          for (const file of filesToDelete) {
            await this.fileService.deleteFile(file.id);
          }

          await this.lessonRepository.delete(lesson.id);
        }

        await this.sectionRepository.delete(sectionId);
      }

      updateCourseDto.course_section.map(async (item) => {
        // nếu không có sectionId tức là có section mới
        if (!item.sectionId) {
          Logger.debug('co section moi');
          const newSection = new Section();
          newSection.nameSection = item.section_name;
          newSection.course = oldCourse;
          const sectionResult = await this.sectionRepository.save(newSection);

          await Promise.all(
            item.lessons.map(async (lessonItem, index) => {
              const lesson = new Lesson();
              lesson.nameLesson = lessonItem.name;
              lesson.section = sectionResult;
              lesson.isActive = true;
              lesson.order = index + 1;

              const lessonResult = await this.lessonRepository.save(lesson);

              const fileUrl = await this.fileService.uploadBase64File(
                lessonItem.video[0].response,
                lessonItem.video[0].type,
                lessonItem.video[0].name,
              );

              Logger.debug('fileUrl cuar lesson', fileUrl);
              Logger.debug('lessonReusult.id lesson', lessonResult.id);
              await this.fileService.saveFile(
                fileUrl,
                null,
                lessonResult.id,
                null,
              );
            }),
          );
        } else {
          Logger.debug('khong co section moi');
          // nếu có sectionId thì check cập nhật section
          const section = await this.sectionRepository.findOne({
            where: { id: item.sectionId },
          });
          if (section) {
            section.nameSection = item.section_name;
            await this.sectionRepository.save(section);
          }

          //check lesson  old và new xem có thay đổi gì không
          const oldLesson = oldCourse.section
            .find((itemSection) => itemSection.id == item.sectionId)
            ?.lesson?.map((itemLesson) => itemLesson.id);

          const newLesson = item.lessons.map(
            (itemLesson) => itemLesson.lessonId,
          );

          // lấy ra những lesson cần xoá mà oldLesson không có trong newLesson
          const lessonToDelete = oldLesson?.filter(
            (item) => !newLesson.includes(item),
          );

          if (lessonToDelete) {
            for (const lessonId of lessonToDelete) {
              const filesToDelete = await this.fileRepository.find({
                where: { lesson: { id: lessonId } },
              });
              for (const file of filesToDelete) {
                await this.fileService.deleteFile(file.id);
              }
              await this.lessonRepository.delete(lessonId);
            }
          }

          const oldSection = await this.sectionRepository.findOne({
            where: { id: item.sectionId },
          });
          if (oldSection) {
            await Promise.all(
              item.lessons.map(async (itemLesson, index) => {
                if (!itemLesson.lessonId) {
                  const newLesson = new Lesson();
                  newLesson.nameLesson = itemLesson.name;
                  newLesson.section = oldSection;
                  newLesson.order = index + 1;
                  const lessonResult = await this.lessonRepository.save(
                    newLesson,
                  );

                  const fileUrl = await this.fileService.uploadBase64File(
                    itemLesson.video[0].response,
                    itemLesson.video[0].type,
                    itemLesson.video[0].name,
                  );
                  Logger.debug('fileUrl cuar lesson', fileUrl);
                  Logger.debug('lessonResult.id lesson', lessonResult.id);
                  await this.fileService.saveFile(
                    fileUrl,
                    null,
                    lessonResult.id,
                    null,
                  );
                } else {
                  const lesson = await this.lessonRepository.findOne({
                    where: { id: itemLesson.lessonId },
                  });
                  if (lesson) {
                    lesson.nameLesson = itemLesson.name;
                    const lessonResult = await this.lessonRepository.save(
                      lesson,
                    );

                    if (!itemLesson?.video[0]?.fileId) {
                      const oldFile = await this.fileRepository.find({
                        where: { lesson: { id: lesson.id } },
                      });
                      for (const file of oldFile) {
                        await this.fileService.deleteFile(file.id);
                      }

                      const fileUrl = await this.fileService.uploadBase64File(
                        itemLesson.video[0].response,
                        itemLesson.video[0].type,
                        itemLesson.video[0].name,
                      );
                      await this.fileService.saveFile(
                        fileUrl,
                        null,
                        lessonResult.id,
                        null,
                      );
                    }
                  }
                }
              }),
            );
          }
        }
      });
    }

    return {
      course,
      status: HttpStatus.OK,
      message: 'Update course successfully',
    };
  }

  async deleteCourseById(id: number): Promise<string> {
    const course = await this.courseRepository.findOne({ where: { id: id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    await this.courseRepository.remove(course);
    return 'Course deleted successfully';
  }
}
