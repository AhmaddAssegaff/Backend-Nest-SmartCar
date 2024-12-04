import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { UserSessionModule } from './user-session/user-session.module';
import { EspGateway } from './webSoket/esp-gateway.gateway';

export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] =
      [AdminModule, AuthModule, UserSessionModule, EspGateway];
    return {
      module: RouterModule,
      providers: [EspGateway],
      exports: [EspGateway],
      controllers: [],
      imports: imports,
    };
  }
}
