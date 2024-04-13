import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { PaymentMethod } from './entities/payment_method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
  ) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodRepository.save(createPaymentMethodDto);
  }

  async findAll(): Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: number): Promise<PaymentMethod | null> {
    return await this.paymentMethodRepository.findOne({ where: { id: id } });
  }

  async update(
    id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<any> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: id },
    });
    if (!paymentMethod) {
      throw new NotFoundException(' Not found payment method');
    }
    if (updatePaymentMethodDto.name !== undefined) {
      paymentMethod.name = updatePaymentMethodDto.name;
    }
    if (updatePaymentMethodDto.description !== undefined) {
      paymentMethod.description = updatePaymentMethodDto.description;
    }
    if (updatePaymentMethodDto.isActive !== undefined) {
      paymentMethod.isActive = updatePaymentMethodDto.isActive;
    }

    const paymentMethodResult = await this.paymentMethodRepository.save(
      paymentMethod,
    );
    return {
      paymentMethodResult,
      status: HttpStatus.OK,
      message: 'Update payment method successfully',
    };
  }

  async remove(id: number): Promise<any> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id: id },
    });
    if (!paymentMethod) {
      throw new NotFoundException(' Not found payment method');
    }
    await this.paymentMethodRepository.delete(id);
    return {
      status: HttpStatus.OK,
      message: 'Update payment method successfully',
    };
  }
}
