import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PaymentDetailsService } from './payment_details.service';
import { CreatePaymentDetailDto } from './dto/create-payment_detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment_detail.dto';
import { PaymentDetail } from './entities/payment_detail.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Details')
@Controller('payment-details')
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Post()
  create(@Body() createPaymentDetailDto: CreatePaymentDetailDto) {
    return this.paymentDetailsService.create(createPaymentDetailDto);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get('get-list')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'ASC' | 'DESC',
  ): Promise<{
    total: number;
    currentPage: number;
    perpage: number;
    data: PaymentDetail[];
  }> {
    if (!search) {
      search = '';
    }
    try {
      const paymentList = await this.paymentDetailsService.findAll(
        page,
        limit,
        search,
        sort,
      );
      return paymentList;
    } catch (error) {
      throw new HttpException(
        `Failed to get list course ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('coures/:id')
  findAllCourse(@Param('id') id: number) {
    return this.paymentDetailsService.findCoursePayments(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePaymentDetailDto: UpdatePaymentDetailDto,
  ) {
    return this.paymentDetailsService.update(id, updatePaymentDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.paymentDetailsService.remove(id);
  }
}
