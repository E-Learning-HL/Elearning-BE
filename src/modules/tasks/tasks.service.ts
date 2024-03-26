import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new examItem';
  }

  findAll() {
    return `This action returns all examItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examItem`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} examItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} examItem`;
  }
}
