import { HttpException, HttpStatus } from '@nestjs/common';

export class OTTException extends HttpException {
  constructor(message: string) {
    super(
      {
        _metadata: {
          message,
          description: 'Bad Request - TokenOTT Issue',
          timestamp: new Date().toISOString(),
          code: 400,
          traceId: Math.random().toString(36).substr(2, 9),
          path: '/api/v1/admin/one-time-token',
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
