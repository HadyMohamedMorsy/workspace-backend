import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { APIFeaturesService } from "../filters/filter.service";

@Injectable()
export class CachingInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheFilters = this.apiFeaturesService.cacheFilters;
    const request = context.switchToHttp().getRequest();
    const { cacheKey, prefix } = this.generateCacheKey(request);

    // Check if the response is already cached
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return new Observable(observer => {
        observer.next(cachedResponse);
        observer.complete();
      });
    }

    // Handle the request and cache the response
    return next.handle().pipe(
      tap(async data => {
        await this.cacheManager.set(cacheKey, data, { ttl: 86400 }); // 1 day TTL
        if (!cacheFilters.has(prefix)) {
          cacheFilters.set(prefix, new Set());
        }
        cacheFilters.get(prefix)?.add(cacheKey);
      }),
    );
  }

  private generateCacheKey(request: any): { cacheKey: string; prefix: string } {
    const { method, url, body } = request;
    const prefix = () => {
      const parts = url.split("/");
      return parts.slice(0, 4).join("/") as string;
    };
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
    return { cacheKey, prefix: prefix() };
  }
}
