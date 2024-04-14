import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { MailService } from 'src/common/mail/mail.service';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.email,
      sub: user.id,
    };
    if (user.isActive == false) {
      throw new HttpException(
        'This user does not access',
        HttpStatus.FORBIDDEN,
      );
    }

    return await {
      status: 200,
      data: {
        accessToken: this.jwtService.sign(payload),
        userId: user.id,
        userName: user.name,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 8);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      isActive : false,
      verificationCode,
    });
    // const { password, ...result } = user;
    // return result;
    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, verificationCode.toString());

    // Schedule to delete user after 5 minutes
    setTimeout(async () => {
      const expiredUser = await this.usersService.findOneByEmail(user.email);
      if (expiredUser && expiredUser.verificationCode === verificationCode) {
        await this.usersService.remove(expiredUser.id);
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return user;
  }

  async sendResetPasswordEmail(email : string): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user){
      throw new HttpException(
        'This user does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.isActive == false){
      throw new HttpException(
        'This user does not access',
        HttpStatus.FORBIDDEN,
      );
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    user.verificationCode = verificationCode
    user.isActive = true
    await this.usersService.updateUserVerificationStatus(user.id, user.isActive, user.verificationCode)

    await this.mailService.sendVerificationEmail(email, verificationCode.toString());
    setTimeout(async () => {
      const expiredUser = await this.usersService.findOneByEmail(email);
      if (expiredUser && expiredUser.verificationCode === verificationCode) {
        user.isActive = true
        user.verificationCode = 0
        await this.usersService.updateUserVerificationStatus(user.id, user.isActive, user.verificationCode);
      }
    }, 5 * 60 * 1000);
    return true; // Hoặc trả về false nếu gặp lỗi
  }

  async verifyEmail(email: string, verificationCode: number): Promise<boolean> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.verificationCode === verificationCode) {
      // Update user's status to active and remove verification code
      user.isActive = true
      user.verificationCode = 0
      await this.usersService.updateUserVerificationStatus(user.id, user.isActive, user.verificationCode);
      return true; // Email verified successfully
    }
    return false; // Verification failed
  }
}
