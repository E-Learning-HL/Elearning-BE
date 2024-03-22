import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

class Video{
  @ApiProperty()
  response: string;

  @ApiProperty()
  uid: string
}

class Image{
  @ApiProperty()
  response: string;

  @ApiProperty()
  uid: string
}

class LessonItem{
  @ApiProperty()
  @IsString()
  nameLessonItem: string;

  @ApiProperty({
    type : [Video]
  })
  videos: Video[];

}

class Lessson{
  @ApiProperty()
  @IsString()
  nameLesson: string;

  @ApiProperty({
    type : [LessonItem]
  })
  lessonItems: LessonItem[];
}

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  nameCourse: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  introduce: string;

  @ApiProperty({
    type : [Image]
  })
  images: Image[];

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    type : [Lessson]
  })
  lessons: Lessson[];

  
}



