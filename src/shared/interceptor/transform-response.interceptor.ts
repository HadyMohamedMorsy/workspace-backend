import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method.toLowerCase();
    const url = request.url;

    const moduleName = url.split("/")[3] || "data";
    const isIndexPost = url.includes("/index") && method === "post";

    const actionMap = {
      post: isIndexPost ? "retrieved" : "created",
      get: "retrieved",
      put: "updated",
      patch: "updated",
      delete: "deleted",
    };

    const action = actionMap[method] || "processed";

    return next.handle().pipe(
      map(data => ({
        message: `${moduleName} ${action} successfully`,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
