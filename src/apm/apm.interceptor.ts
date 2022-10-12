import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { ApmService } from './apm.service';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmSvc: ApmService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        this.apmSvc.captureError(error);
        throw error;
      }),
    );
  }
}
