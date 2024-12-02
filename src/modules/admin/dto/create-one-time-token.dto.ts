import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateOneTimeTokenDto {
  @ApiProperty({
    description: 'The UUID of the user for whom the token will be generated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsString()
  userId: string;
}
