import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports : []
})
export class FileModule {}
