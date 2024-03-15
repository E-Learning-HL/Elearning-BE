import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user) {
            const isValid = this.usersService.isValidPass(password, user.password)
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        return await {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: CreateUserDto) {
        const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
        const user = await this.usersService.create({
          ...createUserDto,
          password: hashedPassword,
        });
        const { password, ...result } = user;
        return result;
      }
}
