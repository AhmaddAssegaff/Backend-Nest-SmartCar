import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
// import { ASYNC_STORAGE } from '@app/core/constants/app.constants';
import {
  AllExceptionsFilter,
  BadRequestExceptionFilter,
  ForbiddenExceptionFilter,
  GatewayTimeOutExceptionFilter,
  NotFoundExceptionFilter,
  OTTExceptionFilter,
  UnauthorizedExceptionFilter,
} from '@core/filters';
import { AppService } from '@app/app.service';
import { AsyncLocalStorage } from 'async_hooks';
import { CommonModule } from '@core/common/common.module';
import { InternalServerErrorExceptionFilter } from '@app/core/filters/internal-server.exception-filter';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { RequestLoggerMiddleware } from '@core/middlewares/logging.middleware';
import { RouterModule } from '@app/modules/router.module';
import { TimeoutInterceptor } from '@core/interceptors/timeout.interceptor';
import { ValidationExceptionFilter } from '@app/core/filters/validatin.exception-filter';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/strategies/auth.guard';

@Module({
  imports: [CommonModule, RouterModule.forRoot()],
  controllers: [],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    PrismaModule,
    AppService,
    // {
    //   provide: ASYNC_STORAGE,
    //   useValue: new AsyncLocalStorage(),
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: InternalServerErrorExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GatewayTimeOutExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OTTExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const timeoutInMilliseconds = 30000;
        return new TimeoutInterceptor(timeoutInMilliseconds);
      },
      inject: [],
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useFactory: (configService: ConfigService) => {
    //     const timeoutInMilliseconds = 30000;
    //     return new TimeoutInterceptor(timeoutInMilliseconds);
    //   },
    //   inject: [ConfigService],
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
