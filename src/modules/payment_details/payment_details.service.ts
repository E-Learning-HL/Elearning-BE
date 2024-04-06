import { Injectable } from '@nestjs/common';
import { CreatePaymentDetailDto } from './dto/create-payment_detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment_detail.dto';
import { PaymentDetail } from './entities/payment_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(PaymentDetail)
    private paymentDetailRepository: Repository<PaymentDetail>,
  ) {}
  create(createPaymentDetailDto: CreatePaymentDetailDto) {
    return 'This action adds a new paymentDetail';
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
    data: PaymentDetail[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<PaymentDetail> = {
      order: { id: sort },
      skip: offset,
      take: limit,
      relations: ['payment', 'course'],
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [{ course: Like(`%${keyword}%`) }];
    }

    const [paymentDetails, total] =
      await this.paymentDetailRepository.findAndCount(searchCondition);

    return {
      total,
      currentPage: page,
      perpage: limit,
      data: paymentDetails,
    };
  }

  async findCoursePayments(id: number): Promise<PaymentDetail[]> {
    const paymentDetailCourse = await this.paymentDetailRepository.find({
      where: {
        payment: { id },
      },
      relations: ['course'],
    });

    return paymentDetailCourse;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentDetail`;
  }

  update(id: number, updatePaymentDetailDto: UpdatePaymentDetailDto) {
    return `This action updates a #${id} paymentDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentDetail`;
  }
}
