import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ForbiddenException } from '@app/core/exceptions/index';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ForbiddenException.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ForbiddenException, host: ArgumentsHost): void {
    this.logger.debug('exception');

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const httpStatus = exception.getStatus();
    const traceId = request.headers.get('x-request-id') || '';
    exception.setTraceId(traceId);
    exception.setPath(httpAdapter.getRequestUrl(ctx.getRequest()));

    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
