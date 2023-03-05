import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as newrelic from 'newrelic';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as util from 'util';

@Injectable()
export class NewRelicInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return newrelic.startWebTransaction(context.getHandler().name, function () {
            const transaction = newrelic.getTransaction();
            return next.handle().pipe(
                tap(() => {
                    console.log(`Method: ${util.inspect(context.getHandler().name)}`);
                    return transaction.end();
                }),
            );
        });
    }
}
