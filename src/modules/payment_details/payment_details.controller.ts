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
  UseGuards,
} from '@nestjs/common';
import { PaymentDetailsService } from './payment_details.service';
import { CreatePaymentDetailDto } from './dto/create-payment_detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment_detail.dto';
import { PaymentDetail } from './entities/payment_detail.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../permissions/permission.decorator';
import { Roles } from '../roles/role.decorator';
import { Permission } from '../permissions/constants/permission.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Role } from '../roles/constants/role.enum';

@ApiTags('Payment Details')
@Controller('payment-details')
@ApiBearerAuth('access-token')
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Post()
  create(@Body() createPaymentDetailDto: CreatePaymentDetailDto) {
    return this.paymentDetailsService.create(createPaymentDetailDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
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

  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
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
