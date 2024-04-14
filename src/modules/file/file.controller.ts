import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // @Post()
  // async uploadVideo(@Body() body: { base64Data: string, filename: string, id : number,  }): Promise<string> {
  //   const { base64Data, filename } = body;
  //   return await this.fileService.uploadBase64File(base64Data, filename);
  // }
  @Get('get-url')
  async getUrl(
    @Query('bucketName') bucketName: string,
    @Query('fileName') fileName: string,
  ) {
    return await this.fileService.getPresignedUrl(bucketName, fileName);
  }
}
