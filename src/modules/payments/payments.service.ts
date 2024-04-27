import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PAYMENT_STATUS } from './constants/payment-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindManyOptions,
  LessThan,
  Like,
  Repository,
  Transaction,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaymentDetail } from '../payment_details/entities/payment_detail.entity';
import { Course } from '../courses/entities/course.entity';
import { PaymentMethod } from '../payment_methods/entities/payment_method.entity';
import { UsersService } from '../users/users.service';
import { PaymentMethodsService } from '../payment_methods/payment_methods.service';
import { IdTokenClient } from 'google-auth-library';
import { UpdateStatusPaymentDto } from './dto/update-status-payment.dto';
import { PaymentDetailsService } from '../payment_details/payment_details.service';
import { Enrolment } from '../enrolments/entities/enrolment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly usersService: UsersService,

    private paymentMethodService: PaymentMethodsService,

    private paymentDetailService: PaymentDetailsService,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(PaymentDetail)
    private paymentDetailRepository: Repository<PaymentDetail>,

    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
  ) {}

  // async create(id: number, createPaymentDto: CreatePaymentDto) {
  //   const user = await this.usersService.findById(id);

  //   if (!user) {
  //     throw new NotFoundException({
  //       status: HttpStatus.NOT_FOUND,
  //       message: 'User not found',
  //     });
  //   }
  //   user.id = id;

  //   const paymentMethod = await this.paymentMethodService.findOne(
  //     createPaymentDto.paymentMethodId,
  //   );

  //   if (!paymentMethod) {
  //     throw new NotFoundException({
  //       status: HttpStatus.NOT_FOUND,
  //       message: 'Payment Method not found',
  //     });
  //   }
  //   paymentMethod.id = createPaymentDto.paymentMethodId;
  //   const payments = new Payment();
  //   payments.amount = createPaymentDto.amount;
  //   payments.status = PAYMENT_STATUS.PENDING;
  //   payments.user = user;
  //   payments.paymentMethod = paymentMethod;

  //   const paymentResult = await this.paymentRepository.save(payments);

  //   for (const item of createPaymentDto.course) {
  //     const course = new Course();
  //     course.id = item.courseId;

  //     const paymentDetail = new PaymentDetail();
  //     paymentDetail.course = course;
  //     paymentDetail.payment = paymentResult;

  //     const paymentDetailResult = await this.paymentDetailRepository.save(
  //       paymentDetail,
  //     );
  //   }

  //   return {
  //     status: HttpStatus.OK,
  //     paymentId: paymentResult.id,
  //   };
  // }

  async create(id: number, createPaymentDto: CreatePaymentDto) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    // Kiểm tra tổng giá của các khóa học
    let totalCoursePrice = 0;
    for (const item of createPaymentDto.course) {
      const course = await this.courseRepository.findOne({
        where: { id: item.courseId },
      });
      if (!course) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: `Course with ID ${item.courseId} not found`,
        });
      }
      totalCoursePrice += course.price;
    }

    if (createPaymentDto.course.length > 1) {
      totalCoursePrice *= 0.7;
    }

    // So sánh tổng giá với số tiền gửi lên
    if (createPaymentDto.amount !== totalCoursePrice) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid amount. The amount should be ${totalCoursePrice}`,
      });
    }

    // Kiểm tra xem user đã mua khóa học này chưa
    for (const item of createPaymentDto.course) {
      const enrolment = await this.enrolmentRepository.findOne({
        where: { user: { id: id }, course: { id: item.courseId } },
      });
      if (enrolment) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          message: `You has already purchased the course `,
        });
      }
    }

    // Tiếp tục tạo thanh toán nếu số tiền gửi lên đúng
    const paymentMethod = await this.paymentMethodService.findOne(
      createPaymentDto.paymentMethodId,
    );

    if (!paymentMethod) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Payment Method not found',
      });
    }
    paymentMethod.id = createPaymentDto.paymentMethodId;
    const payments = new Payment();
    payments.amount = createPaymentDto.amount;
    payments.status = PAYMENT_STATUS.PENDING;
    payments.user = user;
    payments.paymentMethod = paymentMethod;

    const paymentResult = await this.paymentRepository.save(payments);

    for (const item of createPaymentDto.course) {
      const course = new Course();
      course.id = item.courseId;

      const paymentDetail = new PaymentDetail();
      paymentDetail.course = course;
      paymentDetail.payment = paymentResult;

      const paymentDetailResult = await this.paymentDetailRepository.save(
        paymentDetail,
      );
    }

    return {
      status: HttpStatus.OK,
      paymentId: paymentResult.id,
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
    data: Payment[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<Payment> = {
      order: { id: sort },
      skip: offset,
      take: limit,
      relations: ['user', 'paymentMethod'],
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [
        {
          user: {
            name: Like(`%${keyword}%`),
          },
        },
      ];
    }

    const [payments, total] = await this.paymentRepository.findAndCount(
      searchCondition,
    );

    return {
      total,
      currentPage: page,
      perpage: limit,
      data: payments,
    };
  }

  async findStatusPayments(): Promise<Payment[]> {
    const expiredTime = new Date(
      Date.now() - Number(process.env.EXPIRED_TIME) * 60 * 1000,
    );
    return await this.paymentRepository.find({
      where: {
        status: PAYMENT_STATUS.PENDING,
        createdAt: LessThan(expiredTime),
      },
    });
  }

  async findById(id: number): Promise<Payment | null> {
    return await this.paymentRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async updateStatusPayment(
    id: number,
    updateStatusPaymentDto: UpdateStatusPaymentDto,
  ) {
    const payment = await this.findById(id);
    if (!payment) {
      throw new NotFoundException({
        message: 'Payment not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    payment.status = updateStatusPaymentDto.status;
    if (payment.status === PAYMENT_STATUS.SUCCESS) {
      const coursePaymentDetail =
        await this.paymentDetailService.findCoursePayments(payment.id);
      for (const courseItem of coursePaymentDetail) {
        const course = new Course();
        course.id = courseItem?.course.id;

        const user = new User();
        user.id = payment?.user.id;

        const enrolment = new Enrolment();
        enrolment.course = course;
        enrolment.user = user;
        enrolment.isActive = true;

        console.log(`course : ${enrolment.course}, user : ${enrolment.user}`);

        await this.enrolmentRepository.save(enrolment);
      }
    }
    try {
      const statusPayment = await this.paymentRepository.save(payment);
      return {
        statusPayment,
        statusCode: HttpStatus.OK,
        messages: 'Update satus payment successfully',
      };
    } catch (e) {
      throw new HttpException(
        'Update satus payment failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
