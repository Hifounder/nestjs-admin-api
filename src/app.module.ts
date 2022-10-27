import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './packages/winston.config';
import { ApmModule } from './packages/apm/apm.module';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
} from '@nestjs/core';
import { GlobalInterceptor } from './packages/global.interceptor';
import { GlobalFilter } from './packages/global.filter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthorizationModule } from './packages/authorization/authorization.module';
import { AuthModule } from './packages/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoginModule } from './modules/login/login.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenuModule } from './modules/menu/menu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: +process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      synchronize: process.env.TYPEORM_SYNC === 'true',
      logging: process.env.TYPEORM_LOGGING === 'true',
      entities: ['./**/*.entity.js'],
    }),
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    ApmModule,
    PrometheusModule.register(),
    AuthorizationModule.register(),
    RouterModule.register([
      {
        path: 'system',
        children: [
          { path: 'admin', module: AdminModule },
          { path: 'roles', module: RolesModule },
        ],
      },
    ]),
    AdminModule,
    RolesModule,
    AuthModule,
    LoginModule,
    MenuModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
