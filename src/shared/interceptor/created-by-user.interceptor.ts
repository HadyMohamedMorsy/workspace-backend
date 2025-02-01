import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { CreatedByRoute } from "../decorators/created-by.decorator";

@Injectable()
export class CreatedByInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    // Check if the route has the @StoreRoute() decorator
    const isCreatedByIsExist = this.reflector.get<boolean>(CreatedByRoute, context.getHandler());

    if (isCreatedByIsExist && request.method === "POST") {
      const userId = request.headers["user_id"];
      if (userId) {
        request.body.created_by = userId;
      }
    }

    return next.handle();
  }
}
