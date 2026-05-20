import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Очень хорошая статья',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsNumber()
  newsId?: number;
}
