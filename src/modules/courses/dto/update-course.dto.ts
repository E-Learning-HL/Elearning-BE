// import { PartialType } from '@nestjs/swagger';
// import { CreateCourseDto } from './create-course.dto';

// export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class File {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fileId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  response: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;
}

class Lesson {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  lessonId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  video: File[];
}

class Section {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  sectionId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  section_name: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  lessons: Lesson[];
}

export class UpdateCourseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  introduce?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listening?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  writing?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  speaking?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reading?: string;

  @ApiProperty({ example: '100-300', required: false })
  @IsOptional()
  @IsString()
  course_level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  cover?: File[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  course_section?: Section[];
}
