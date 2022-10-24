import { Injectable } from '@nestjs/common';
import * as apm from 'elastic-apm-node';

@Injectable()
export class ApmService {
  private readonly apm: apm.Agent = apm;

  captureError(data: any): void {
    this.apm.captureError(data);
  }

  startTransaction(
    name?: string,
    options?: apm.TransactionOptions,
  ): apm.Transaction | null {
    return this.apm.startTransaction(name, options);
  }

  setTransactionName(name: string): void {
    this.apm.setTransactionName(name);
  }

  startSpan(name?: string, options?: apm.SpanOptions): apm.Span | null {
    return this.apm.startSpan(name, options);
  }

  setCustomContext(context: Record<string, unknown>) {
    this.apm.setCustomContext(context);
  }
}
