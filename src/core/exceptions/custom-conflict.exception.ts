import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomConflictException extends HttpException {
  constructor(message: string, code: number) {
    super(
      {
        _metadata: {
          message,
          description: 'Conflict',
          timestamp: new Date().toISOString(),
          code,
        },
      },
      HttpStatus.CONFLICT,
    );
  }
}
