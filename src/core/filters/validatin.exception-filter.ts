import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { BadRequestException } from '@app/core/exceptions/index';
import { ExceptionConstants } from '@app/core/exceptions/constants';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ValidationError } from 'class-validator';
import { v4 as randomUUID } from 'uuid';

/**
 * An exception filter to handle validation errors thrown by class-validator.
 */
@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Handle a validation error.
   * @param exception The validation error object.
   * @param host The arguments host object.
   */
  catch(exception: ValidationError, host: ArgumentsHost): void {
    this.logger.verbose(exception);

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    const request = ctx.getRequest<Request>();
    const traceId = request.headers['x-request-id'] || randomUUID();
    request.headers['x-request-id'] = traceId; // Directly set the header
    // Example of fetching path to attach path inside response object
    // const path = httpAdapter.getRequestUrl(request);

    const errorMsg = exception.constraints || exception.children?.[0]?.constraints;

    // Create a new BadRequestException with the validation error message.
    const err = BadRequestException.VALIDATION_ERROR(Object.values(errorMsg || {})[0]);
    // const responseBody = {
    //   error: err.code,
    //   message: err.message,
    //   timestamp: new Date().toISOString(),
    //   traceId: request.id,
    // };

    const responseBody = {
      _metadata: {
        message: err.message,
        description: err.message,
        timestamp: new Date().toISOString(),
        code: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
        traceId,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
    };

    // Uses the HTTP adapter to send the response with the constructed response body
    // and the HTTP status code.
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}