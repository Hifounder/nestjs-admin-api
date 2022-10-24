import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './packages/winston.config';
import { ApmModule } from './packages/apm/apm.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './packages/global.interceptor';
import { GlobalFilter } from './packages/global.filter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthorizationModule } from './packages/authorization/authorization.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoginModule } from './modules/login/login.module';
import { RolesModule } from './modules/roles/roles.module';

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
    AuthorizationModule,
    AuthModule,
    AdminModule,
    LoginModule,
    RolesModule,
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
  ],
})
export class AppModule {}
