import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { Enrolment } from './entities/enrolment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { use } from 'passport';

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

  async findOne(id: number) : Promise<any> {
    console.log("id" ,id)
    const courses = await this.enrolmentRepository.find({
      where : {
        user : {id : id},
        
      },
      relations : ['course', 'course.file']
    })
    if(!courses){
      throw new NotFoundException('Bạn chưa đăng ký khóa học nào.');
    }
    return courses
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
