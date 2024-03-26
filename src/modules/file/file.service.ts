import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Minio from 'minio';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { FileEntity } from './entities/file.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class FileService {
  private readonly minioClient: Minio.Client;

  constructor(
    @InjectRepository(FileEntity)
    private fileRebository: Repository<FileEntity>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_HOST || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_SSL === 'true' ? true : false,
      accessKey: process.env.MINIO_ACCESSKEY || 'elearning',
      secretKey: process.env.MINIO_SECRETKEY || '123456caA@',
    });
  }

  async getPresignedUrl(bucketName: string, fileName: string): Promise<string> {
    try {
      const url = await this.minioClient.presignedGetObject(
        bucketName,
        fileName,
      );
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  async uploadBase64File(
    base64Data: string,
    type: string,
    fileName: string,
  ): Promise<string> {
    const dataFile = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(dataFile, 'base64');
    const metadata = {
      'Content-Type': type,
    };
    const bucketName = process.env.MINIO_BUCKET || 'elearning';
    const file = `${uuid()}_${fileName}`;

    try {
      await this.minioClient.putObject(bucketName, file, buffer, metadata);
    } catch (error) {
      throw new Error(error);
    }

    const url = await this.getPresignedUrl(bucketName, file);

    return url;
  }

  async saveFile(
    url: string,
    courseId: number | null,
    lessonId: number | null,
    taskId: number | null,
  ): Promise<FileEntity> {
    const fileEntity = new FileEntity();
    fileEntity.url = url;
    if (courseId !== null) {
      const course = new Course();
      course.id = courseId;
      fileEntity.course = course;
    }
    if (lessonId !== null) {
      const lesson = new Lesson();
      lesson.id = lessonId;
      fileEntity.lesson = lesson;
    }
    if (taskId !== null) {
      const task = new Task();
      task.id = taskId;
      fileEntity.task = task;
    }
    return await this.fileRebository.save(fileEntity);
  }
}
