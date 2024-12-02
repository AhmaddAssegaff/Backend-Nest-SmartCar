import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'ahmad',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'ahmad123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: Role,
    example: Role.user,
  })
  @IsEnum(Role, { message: `Role must be one of the following: ${Object.values(Role).join(', ')}` })
  role: Role;
}
