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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ChangePassDTO } from './dto/change-password.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async getList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sort') sort: 'ASC' | 'DESC',
  ) : Promise<{ count: number, currentPage: number, perpage: number, data: User[] }> {
    if(!search){
      search = ''
    }
    return this.usersService.getList(page, limit, search, sort);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(id, updateUserDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  async activateUser(@Param('id', ParseIntPipe) id: number) {
    const updatedUser = await this.usersService.updateUserStatus(id, true);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      status : HttpStatus.OK,
      message: 'User activated successfully' 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivateUser(@Param('id', ParseIntPipe) id: number) {
    const updatedUser = await this.usersService.updateUserStatus(id, false);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      status : HttpStatus.OK,
      message: 'User deactivated successfully' 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePassDto: ChangePassDTO,
  ) {
    const { oldPassword, newPassword, confirmPassword } = changePassDto;

    if (newPassword != confirmPassword) {
      throw new UnauthorizedException(
        'New password and confirm password do not match',
      );
    }

    const updatePassword = await this.usersService.changePasswordUser(
      id,
      oldPassword,
      newPassword,
    );
    if (!updatePassword) {
      throw new NotFoundException('User not found');
    }

    return  { 
      status : HttpStatus.OK, 
      message: 'Password changed successfully' 
    };
  }
}
