import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Query,
  Put,
  Logger,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Payment } from './entities/payment.entity';
import { UpdateStatusPaymentDto } from './dto/update-status-payment.dto';
import { Roles } from '../roles/role.decorator';
import { Permissions } from '../permissions/permission.decorator';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Role } from '../roles/constants/role.enum';
import { Permission } from '../permissions/constants/permission.enum';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth('access-token')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.SUPER_ADMIN, Role.USER)
  @Permissions(Permission.CREATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Post('create-payment')
  async create(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentsService.create(req.user.id, createPaymentDto);
  }

  @Roles(Role.SUPER_ADMIN, Role.USER)
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
    data: Payment[];
  }> {
    if (!search) {
      search = '';
    }
    try {
      const paymentList = await this.paymentsService.findAll(
        page,
        limit,
        search,
        sort,
      );
      return paymentList;
    } catch (error) {
      throw new HttpException(
        `Failed to get list payment ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('status-payment')
  findOne() {
    return this.paymentsService.findStatusPayments();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.paymentsService.findById(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch('update-payment/:id')
  update(
    @Param('id') id: number,
    @Body() updateStatusPaymentDto: UpdateStatusPaymentDto,
  ) {
    return this.paymentsService.updateStatusPayment(id, updateStatusPaymentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(+id);
  // }
}
