import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  async login(@Body() loginDto: AuthLoginDTO) {
    const loggedInUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!loggedInUser) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authService.login(loggedInUser);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<{ success: boolean }> {
    const { email, verificationCode } = verifyEmailDto;
    const isVerified = await this.authService.verifyEmail(
      email,
      verificationCode,
    );
    return { success: isVerified };
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<{ success: boolean }> {
    const { email } = forgetPasswordDto;
    const isSent = await this.authService.sendResetPasswordEmail(email);
    return { success: isSent };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const resetPassword = await this.usersService.resetPasswordUser(resetPasswordDto.email, resetPasswordDto.newPassword);
    return resetPassword
  }
}
