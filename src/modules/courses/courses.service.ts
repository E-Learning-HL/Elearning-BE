import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRebository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      return await this.courseRebository.save(createCourseDto);
    } catch (e) {
      throw new HttpException(
        "There's an error when create cource",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{
    count: number;
    currentPage: number;
    perpage: number;
    data: Course[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<Course> = {
      order: { id: sort },
      skip: offset,
      take: limit,
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [{ nameCourse: Like(`%${keyword}%`) }];
    }

    const [courses, count] = await this.courseRebository.findAndCount(
      searchCondition,
    );

    return {
      count,
      currentPage: page,
      perpage: limit,
      data: courses,
    };
  }

  async findOne(id: number): Promise<Course | null> {
    try {
      return await this.courseRebository.findOneOrFail({
        where: { id: id },
      });
    } catch (e) {
      throw new HttpException(
        "There's an error when get course by id",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRebository.findOne({
      where: { id: id },
    });

    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (updateCourseDto.nameCourse !== undefined) {
      course.nameCourse = updateCourseDto.nameCourse;
    }
    if (updateCourseDto.price !== undefined) {
      course.price = updateCourseDto.price;
    }
    if (updateCourseDto.introduce !== undefined) {
      course.introduce = updateCourseDto.introduce;
    }
    if (updateCourseDto.images !== undefined) {
      // course.imageUrl = updateCourseDto.images;
    }
    if (updateCourseDto.isActive !== undefined) {
      course.isActive = updateCourseDto.isActive;
    }

    try {
      return await this.courseRebository.save(course);
    } catch (error) {
      throw new HttpException(
        'Failed to save course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
