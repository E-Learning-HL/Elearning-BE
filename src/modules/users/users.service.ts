import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private datasource: DataSource,
  ) {}
  create(createUserDto: CreateUserDto) : Promise<User> {
    const user = new User();

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.address = createUserDto.address;
    user.isActive = createUserDto.isActive ;
    user.phone = createUserDto.phone

    return this.usersRepository.save(user);
  }

  findAll() : Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string) {
    const user = this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  isValidPass(password: string, hash: string) {
    if (password == hash) 
      return true;
    return false;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) : Promise<void> {
    await this.usersRepository.delete(id);
  }
}
