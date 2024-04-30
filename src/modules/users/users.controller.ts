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
  Req,
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
import { Roles } from '../roles/role.decorator';
import { Role } from '../roles/constants/role.enum';
import { Permission } from '../permissions/constants/permission.enum';
import { Permissions } from '../permissions/permission.decorator';
import { RoleGuard } from '../roles/guards/role.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
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

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @Get('/list')
  async getList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    // @Query('search') search: string,
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('role') role: string,
    @Query('sort') sort: 'ASC' | 'DESC',
  ): Promise<{
    count: number;
    currentPage: number;
    perpage: number;
    data: User[];
  }> {
    // if (!search) {
    //   search = '';
    // }
    if (!email) email = '';
    if (!name) name = '';
    if (!role) role = '';

    try {
      const userList = await this.usersService.getList(
        page,
        limit,
        // search,
        email,
        name,
        role,
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.READ)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Get('admin/user/:id')
  getUser(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      return {
        status : HttpStatus.OK,
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

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @Permissions(Permission.UPDATE)
  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @Patch('change-password')
  async changePassword(@Req() req, @Body() changePassDto: ChangePassDTO) {
    const { oldPassword, newPassword } = changePassDto;
    const updatePassword = await this.usersService.changePasswordUser(
      req.user.id,
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
