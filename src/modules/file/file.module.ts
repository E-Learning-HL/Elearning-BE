import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioModule, MinioService } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioConfig } from 'src/common/config/config.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';

@Module({
  controllers: [FileController],
  providers: [FileService, ConfigService],
  exports: [FileService],
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MinioModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const minioConfig = config.get<MinioConfig>('minio');
        if (!minioConfig) {
          throw new Error('Minio configuration is missing!'); // Handle missing config
        }
        return await {
          // endPoint: config.get<string>('minio.host') || 'localhost',
          // port: 9000,
          // useSSL: false,
          // accessKey: config.get<string>('minio.accessKey') || 'elearning',
          // secretKey: config.get<string>('minio.secretKey') || '123456caA@',
          endPoint: minioConfig.endPoint || 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: minioConfig.accessKey || 'elearning',
          secretKey: minioConfig.secretKey || '123456caA@',
        };
      },
    }),
  ],
})
export class FileModule {}
