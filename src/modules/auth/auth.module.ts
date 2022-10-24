import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.OFFICIAL_JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    AdminModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
