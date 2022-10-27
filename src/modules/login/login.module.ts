import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthModule } from '../../packages/auth/auth.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [AuthModule, AdminModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
