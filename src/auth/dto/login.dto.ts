import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'email',
    example: 'user@test.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'user1234',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
