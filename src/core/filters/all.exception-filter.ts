import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const traceId = request.headers['x-request-id'] || '';
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Check if the exception is an instance of HttpException
    let message = 'An unexpected error occurred';
    let errorDescription = 'Internal server error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    // If it's an instance of HttpException, we can extract the response details
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // Check if response is an object and matches ErrorResponse structure
      if (typeof response === 'object' && response !== null) {
        const errorResponse = response as ErrorResponse;
        message = errorResponse.message || message;
        errorDescription = errorResponse.error || errorDescription;
        statusCode = errorResponse.statusCode || statusCode;
      }
    }

    const responseBody = {
      _metadata: {
        message,
        description: errorDescription,
        timestamp: new Date().toISOString(),
        code:
          statusCode === HttpStatus.NOT_FOUND
            ? ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND
            : ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
        traceId,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
