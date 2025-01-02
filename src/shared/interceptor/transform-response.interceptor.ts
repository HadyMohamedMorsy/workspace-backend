import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        message: `data was successfully reviewed`,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
