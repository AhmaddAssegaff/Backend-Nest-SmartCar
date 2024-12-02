import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { GatewayTimeoutException } from '@app/core/exceptions/index';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(GatewayTimeoutException)
export class GatewayTimeOutExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GatewayTimeoutException.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: GatewayTimeoutException, host: ArgumentsHost): void {
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
