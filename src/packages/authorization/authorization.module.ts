import { DynamicModule, Module } from '@nestjs/common';
import { newEnforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { AuthorizationService } from './authorization.service';
import { AUTHORIZATION_ENFORCER } from './token.const';

export interface RegisterOptions {
  path: string;
  global?: boolean;
}

@Module({})
export class AuthorizationModule {
  static register(options: RegisterOptions): DynamicModule {
    const { path, global = false } = options;
    const providers = [
      {
        provide: AUTHORIZATION_ENFORCER,
        useFactory: async () => {
          const a = await TypeORMAdapter.newAdapter({
            type: process.env.TYPEORM_CONNECTION as any,
            host: process.env.TYPEORM_HOST,
            port: +process.env.TYPEORM_PORT,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
          });
          const e = await newEnforcer(path, a);
          return e;
        },
      },
      AuthorizationService,
    ];

    return {
      global,
      providers,
      module: AuthorizationModule,
      exports: [...providers],
    };
  }
}
