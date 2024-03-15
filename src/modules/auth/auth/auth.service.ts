import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/common/config/config.type';
import NodeRSA from 'node-rsa';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { UsersService } from 'src/modules/res/res.user/user.service';
import { ForgotService } from 'src/modules/forgot/forgot.service';
import { MailService } from 'src/common/mail/mail.service';
import { User } from 'src/modules/res/res.user/entities/user.entity';
import { JwtTokenData } from './strategies/jwt_data.type';
import {
  CryptoContext,
  CryptoContextOld,
  HashingStrategy,
} from 'src/utils/crypto/passlib_crypto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      username: loginDto.username,
    });
    if (user == null) {
      throw new HttpException(
        'This email is not registed before.',
        HttpStatus.NOT_FOUND,
      );
    }

    let cryptoContext = new CryptoContext({
      digest: HashingStrategy.PBKDF2_SHA512,
      encoding: 'base64',
    });

    try {
      if (!cryptoContext.verify(loginDto.password, user.password)) {
        throw new UnauthorizedException('Password is not correct.');
      }
    } catch (err) {
      /**
       * Ngày xưa cái hàm crypto nó bị sai nên dẫn đến password cũ bị sai,
       * chỉnh thành cái mới chuẩn rồi nhưng bị lỗi những tài khoản cũ, nên dùng cả hai cái cách làm cũ, sau này ổn định hãy bỏ cái cũ này đi nhé
       */
      cryptoContext = new CryptoContextOld({
        digest: HashingStrategy.PBKDF2_SHA512,
        encoding: 'base64',
      });
      if (!cryptoContext.verify(loginDto.password, user.password)) {
        throw new UnauthorizedException('Password is not correct.');
      }
    }

    if (user.active == false) {
      throw new HttpException(
        'This user is inaccessible',
        HttpStatus.FORBIDDEN,
        {},
      );
    }
    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      username: user.partner.name,
      email: user.username,
      lang: user.partner.lang,
      partnerId: user.partner.id,
      name: user.partner.name,
    });
    return {
      token,
      refreshToken,
      tokenExpires,
      user: {
        active: user.active,
        id: user.id,
        username: user.partner.name,
        email: user.username,
        signature: user.signature,
        share: user.share,
        partnerId: user.partner.id,
        lang: user.partner.lang,
        name: user.partner.name,
        isPublicUser: user.isPublicUser(),
      },
      isAuthenticated: true,
    };
  }
  async register(dto: AuthRegisterLoginDto) {
    try {
      return await this.usersService.create(dto);
    } catch (err) {
      console.log(err);

      throw new HttpException(
        {
          message: "There's an error when registering account.",
          isRegister: false,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async confirmEmail(hash: string): Promise<void> {
  //   const user = await this.usersService.findOne({
  //     hash,
  //   });
  //   if (!user) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: `notFound`,
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   user.hash = null;
  //   user.status = plainToClass(Status, {
  //     id: StatusEnum.active,
  //   });
  //   await user.save();
  // }
  // async forgotPassword(email: string): Promise<void> {
  //   const user = await this.usersService.findOne({
  //     email,
  //   });
  //   if (!user) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           email: 'emailNotExists',
  //         },
  //       },
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  //   const hash = crypto
  //     .createHash('sha256')
  //     .update(randomStringGenerator())
  //     .digest('hex');
  //   await this.forgotService.create({
  //     hash,
  //     user,
  //   });
  //   await this.mailService.forgotPassword({
  //     to: email,
  //     data: {
  //       hash,
  //     },
  //   });
  // }
  async changePaswword(hash: string, password: string): Promise<void> {}
  async refreshToken(user: any) {
    return await this.getTokensData({
      id: user.id,
      username: user.username,
      lang: user.lang,
      email: user.email,
      partnerId: user.partnerId,
    });
  }

  private async getTokensData(data: JwtTokenData) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(data, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
        privateKey: this.configService.getOrThrow('auth.privateKey', {
          infer: true,
        }),
      }),
      await this.jwtService.signAsync(data, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
          infer: true,
        }),
        privateKey: this.configService.getOrThrow('auth.privateKey', {
          infer: true,
        }),
      }),
    ]);
    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
