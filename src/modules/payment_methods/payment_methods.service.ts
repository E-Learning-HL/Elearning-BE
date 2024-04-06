import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { PaymentMethod } from './entities/payment_method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentMethodsService {
  constructor(

    @InjectRepository(PaymentMethod)
    private paymentMethodRepository : Repository<PaymentMethod>,

  ) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodRepository.save(createPaymentMethodDto)
  }

  async findAll() : Promise<PaymentMethod[]> {
    return await this.paymentMethodRepository.find({where : {isActive : true}})
    
  }

  async findOne(id: number) : Promise<PaymentMethod | null> {
    return await  this.paymentMethodRepository.findOne({ where : {id : id}});
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
