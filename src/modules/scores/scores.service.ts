import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>
  ) {}
  create(createScoreDto: CreateScoreDto) {
    return 'This action adds a new score';
  }

  async findAll() {
    try {
      return await this.scoreRepository.find({
        relations : ['task', 'user']
      })
    } catch (error){
      throw new HttpException('Not found score', HttpStatus.NOT_FOUND);
    }
  }

  async findOne(userId: number, taskId : number) {
    try {
      return await this.scoreRepository.findOne({
        where: {
          // id : id,
          user : {id : userId},
          task : {id : taskId}
        },
        relations : ['task']
      })
    } catch (error){
      throw new HttpException('Not found score', HttpStatus.NOT_FOUND);
    }
  }

  update(id: number, updateScoreDto: UpdateScoreDto) {
    return `This action updates a #${id} score`;
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
