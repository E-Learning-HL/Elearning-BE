import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  NotFoundException,
  ParseIntPipe,
  UnauthorizedException,
  HttpStatus,
  Query,
  DefaultValuePipe,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangePassDTO } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateStatusUserDto } from './dto/update-status-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const user = this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return {
        message: 'User created successfully',
        status: HttpStatus.OK,
        user,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get('/list')
  async getList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sort') sort: 'ASC' | 'DESC',
  ): Promise<{
    count: number;
    currentPage: number;
    perpage: number;
    data: User[];
  }> {
    if (!search) {
      search = '';
    }

    try {
      const userList = await this.usersService.getList(
        page,
        limit,
        search,
        sort,
      );
      return userList;
    } catch (error) {
      throw new HttpException(
        'Failed to get list user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return {
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.usersService.remove(id);
  // }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('status/:id')
  async activateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusUserDto: UpdateStatusUserDto,
  ) {
    const { isActive } = updateStatusUserDto;
    const updatedUser = await this.usersService.updateUserStatus(id, isActive);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      status: HttpStatus.OK,
      message: isActive
        ? 'User activated successfully'
        : 'User deactivated successfully',
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('change-password/:id')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePassDto: ChangePassDTO,
  ) {
    const { oldPassword, newPassword } = changePassDto;

    const updatePassword = await this.usersService.changePasswordUser(
      id,
      oldPassword,
      newPassword,
    );
    if (!updatePassword) {
      throw new NotFoundException('User not found');
    }

    return {
      status: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
}
