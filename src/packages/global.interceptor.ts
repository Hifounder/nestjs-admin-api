import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, map } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const { ip, method, originalUrl } = req;
    const clientIP = req.headers['x-forwarded-for'] ?? ip;
    const requestMsg = {
      clientIP,
      method,
      protocol: req.protocol,
      hostname: req.get('host'),
      originalUrl,
      query: req.query,
      params: req.params,
      body: req.body,
    };

    this.logger.info(`${controller}::${handler}::Request`, {
      data: requestMsg,
    });

    return next.handle().pipe(
      map((data) => {
        this.logger.info(`${controller}::${handler}::Response`, { data: data });
        return data;
      }),
    );
  }
}
