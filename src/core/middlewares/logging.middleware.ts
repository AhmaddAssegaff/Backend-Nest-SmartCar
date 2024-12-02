import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Ensure the header value is a string
    const xRequestId = Array.isArray(req.headers['x-request-id'])
      ? req.headers['x-request-id'][0] // If it's an array, take the first value
      : req.headers['x-request-id']; // Otherwise, it's a single string

    // If there's no 'x-request-id', assign a new one
    if (!xRequestId) {
      req.headers['x-request-id'] = randomUUID();
    } else {
      req.headers['x-request-id'] = xRequestId;
    }

    const traceId = req.headers['x-request-id'] as string; // Cast as string here

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode >= 400 && statusCode <= 500) {
        this.logger.warn(`[${traceId}] [${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
