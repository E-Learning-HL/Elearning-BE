import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports : [
    MinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
          return await {
              endPoint: config.get<string>('minio.host') || 'localhost',
              port: 9000,
              useSSL: false,
              accessKey: config.get<string>('minio.accessKey') || 'elearning',
              secretKey: config.get<string>('minio.secretKey') || '123456caA@',

          };
      },
  }),
  ]
})
export class FileModule {}