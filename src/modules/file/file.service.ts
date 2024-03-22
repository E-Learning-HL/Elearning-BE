import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Minio from 'minio';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, MinioConfig } from 'src/common/config/config.type';
import { Readable } from 'stream';
import { MinioClient, MinioService } from 'nestjs-minio-client';

@Injectable()
export class FileService {
  private readonly minioClient: MinioClient;
  private readonly minioConfig!: MinioConfig;

  constructor(
    private readonly config: ConfigService,
    private readonly minio: MinioService,
    ) {}

  async uploadBase64File(
    base64Data: string,
    filename: string,
  ): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const stream = bufferToStream(buffer);
    const bucketName = this.config.get<MinioConfig>('minio.bucketName')?.toString() || 'elearning';
    await this.minioClient.putObject(bucketName, filename, stream);
    return `File uploaded successfully: ${filename}`;
  }
}

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}