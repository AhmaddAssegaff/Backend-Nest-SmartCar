import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { OTTException } from '@core/exceptions/OTT-exception';

@Catch(OTTException)
export class OTTExceptionFilter implements ExceptionFilter {
  catch(exception: OTTException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();

    // Mendapatkan metadata dari exception
    const errorResponse = exception.getResponse();

    // Mengirimkan response dengan format sesuai yang diinginkan
    response.status(status).json(errorResponse);
  }
}
