import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() user: User) {
    const loggedInUser = await this.authService.validateUser(
      user.email,
      user.password,
    );
    if (!loggedInUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(loggedInUser);
    return this.authService.login(loggedInUser);
  }
}
