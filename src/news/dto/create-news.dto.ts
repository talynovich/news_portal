import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Title',
    example: 'News item',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description',
    example: 'News description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
