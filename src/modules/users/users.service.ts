import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, FindManyOptions, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private datasource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.save(createUserDto);
    } catch (e) {
      throw new HttpException(
        "There's an error when registering account.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getList(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sort: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{
    count: number;
    currentPage: number;
    perpage: number;
    data: User[];
  }> {
    const offset = (page - 1) * limit;

    const searchCondition: FindManyOptions<User> = {
      order: { id: sort },
      skip: offset,
      take: limit,
    };

    const keyword = search.trim();
    if (keyword !== '') {
      searchCondition.where = [
        { email: Like(`%${keyword}%`) },
        { name: Like(`%${keyword}%`) },
      ];
    }

    const [users, count] = await this.usersRepository.findAndCount(
      searchCondition,
    );

    return {
      count,
      currentPage: page,
      perpage: limit,
      data: users,
    };
  }

  findOneByEmail(email: string): Promise<User | null> {
    const user = this.usersRepository.findOne({
      where: { email: email },
    });
    // console.log(user);
    return user;
  }

  findById(id: number): Promise<User | undefined> {
    const user = this.usersRepository.findOneOrFail({
      where: { id: id },
      select: ['name', 'email', 'phone', 'address', 'isActive'],
    });

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) : Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where : {id : id}
    })

    if(!user){
      throw new NotFoundException({
        message : "User not found",
        status : HttpStatus.NOT_FOUND
      })
    }
    user.name = updateUserDto.name
    user.address = updateUserDto.address
    user.phone = updateUserDto.phone
    user.isActive = updateUserDto.isActive
    
    if(updateUserDto.password){
      const password = await bcrypt.hash(updateUserDto.password, 10)
      user.password = password
    }

    try {
      return await this.usersRepository.save(user)
    } catch (error){
      throw new HttpException('Failed to save user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number): Promise<string> {
    await this.usersRepository.delete(id);
    return 'User deleted successfully'; 
  }

  async updateUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
    user.isActive = isActive;

    try {
      return await this.usersRepository.save(user)
    } catch (error){
      throw new HttpException('Failed to save user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePasswordUser(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid old password ',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    try {
      return await this.usersRepository.save(user)
    } catch (error){
      throw new HttpException('Failed to save user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
