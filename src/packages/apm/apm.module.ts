import { Module } from '@nestjs/common';
import { ApmInterceptor } from './apm.interceptor';
import { ApmService } from './apm.service';

@Module({
  providers: [ApmService, ApmInterceptor],
  exports: [ApmService],
})
export class ApmModule {}
