import { DynamicModule, Module } from '@nestjs/common';
import { casbinInit } from '../utils/role';
import { AuthorizationService } from './authorization.service';
import { AUTHORIZATION_ENFORCER } from './token.const';

@Module({})
export class AuthorizationModule {
  static register(): DynamicModule {
    const providers = [
      {
        provide: AUTHORIZATION_ENFORCER,
        useFactory: async () => casbinInit(),
      },
      AuthorizationService,
    ];

    return {
      global: true,
      providers,
      module: AuthorizationModule,
      exports: [...providers],
    };
  }
}
