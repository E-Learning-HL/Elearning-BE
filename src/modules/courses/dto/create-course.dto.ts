import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

class File {
  @ApiProperty()
  response: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;
}

class Lesson {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    type: [File],
  })
  @IsArray()
  video: File[];
}

class Section {
  @ApiProperty()
  @IsString()
  section_name: string;

  @ApiProperty({
    type: [Lesson],
  })
  @IsArray()
  lessons: Lesson[];
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  introduce: string;

  @ApiProperty()
  @IsString()
  listening: string;

  @ApiProperty()
  @IsString()
  writing: string;

  @ApiProperty()
  @IsString()
  speaking: string;

  @ApiProperty()
  @IsString()
  reading: string;

  @ApiProperty()
  @IsNumber()
  course_level: number;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    type: [File],
  })
  @IsArray()
  cover: File[];

  @ApiProperty({
    type: [Section],
  })
  @IsArray()
  course_section: Section[];
}
