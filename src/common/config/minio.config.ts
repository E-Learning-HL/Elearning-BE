import { registerAs } from '@nestjs/config';
import { MinioConfig } from './config.type';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {

  @IsString()
  @IsOptional()
  MINIO_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MINIO_PORT: number;

  @IsString()
  @IsOptional()
  MINIO_ACCESSKEY: string;

  @IsString()
  @IsOptional()
  MINIO_SECRETKEY: string;

  @IsString()
  @IsOptional()
  MINIO_BUCKET: string;

  @IsBoolean()
  @IsOptional()
  MINIO_SSL: boolean;
}

export default registerAs<MinioConfig>('minio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKey: process.env.MINIO_ACCESSKEY || 'elearning',
    secretKey: process.env.MINIO_SECRETKEY || '123456caA@',
    endPoint: process.env.MINIO_HOST || 'localhost',
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
    bucketName: process.env.MINIO_BUCKET || 'elearning',
    useSSL: process.env.MINIO_SSL === 'false',
  };
});
