import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
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

  @ApiProperty({
    description: 'username',
    example: 'user1234',
  })
  @IsString()
  username: string;
}
