import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nama pengguna (credential utama)',
    type: String,
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Kata sandi pengguna untuk autentikasi',
    type: String,
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
