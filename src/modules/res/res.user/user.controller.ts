import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { User } from './entities/user.entity';
import { GetUserOptionDto } from './dtos/get_user.dto';
import { Between, FindOptionsSelect, Like } from 'typeorm';
import { PermissionMode } from 'src/modules/ir/ir.model.access/enum/permission.enum';
import { Roles } from 'src/modules/roles/roles.decorator';
import { RolesGuard } from 'src/modules/roles/guards/roles.guard';
import { UpdateUserDto } from './dtos/update_user.dto';
import { identity } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/modules/auth/auth/strategies/jwt.strategy';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UsersService) {}

  @Get('')
  @Roles({
    mode: PermissionMode.READ,
    model: User,
  })
  @UseGuards(RolesGuard)
  @ApiQuery({
    type: GetUserOptionDto,
  })
  getUsers(@Query() options: any) {
    const hasKarmaMin = Boolean(options.karma_min);
    const hasKarmaMax = Boolean(options.karma_max);

    const hasKarma = hasKarmaMax || hasKarmaMin;

    const selectParner: FindOptionsSelect<User> = {
      partner: {
        name: true,
        displayName: true,
        phone: true,
        mobile: true,
        email: true,
      },
    };
    return this.userService.getAllUser({
      where: {
        active: options.active || undefined,
        partner: {
          name: options.name
            ? Like(`%${options.name.replace(' ', '%')}%`)
            : undefined,
        },
        karma: hasKarma
          ? Between(options.karma_min ?? 0, options.karma_max ?? 9999999999)
          : undefined,
      },
      select: selectParner,
      relations: ['partner'],
    });
  }

  @Get(':id/profile')
  @Roles({
    mode: PermissionMode.READ,
    model: User,
  })
  @UseGuards(RolesGuard)
  getUser(@Param('id') id: number) {
    return this.userService.getAllUser({
      where: {
        active: true,
        id: id,
      },
      select: {
        partner: {
          name: true,
          displayName: true,
          phone: true,
          mobile: true,
          email: true,
        },
      },
      relations: ['partner'],
    });
  }

  @Post(':id/update')
  @Roles({
    mode: PermissionMode.WRITE,
    model: User,
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @Roles({
    mode: PermissionMode.WRITE,
    model: User,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard, RolesGuard)
  async updateUser(
    @Request() request,
    @Param('id') id: number,
    @Body() payload: any,
  ) {
    const requestUserId = request.user.id;
    if (requestUserId != id) {
      throw new UnauthorizedException({
        error: 'You are not authorized to change other infomation.',
      });
    }
    try {
      await this.userService.update(id, payload);
    } catch (err) {
      throw new NotFoundException(err);
    }
  }
}
