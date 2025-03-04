import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Observable, tap } from "rxjs";
import { APIFeaturesService } from "../filters/filter.service";

@Injectable()
export class DeleteCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheFilters = this.apiFeaturesService.cacheFilters;
    const { url } = context.switchToHttp().getRequest();

    // Handle the request and cache the response
    return next.handle().pipe(
      tap(async () => {
        await this.clearCach(cacheFilters, url);
      }),
    );
  }

  async clearCach(cacheFilters: Map<string, Set<string>>, prefix: string): Promise<void> {
    const url = () => {
      const parts = prefix.split("/");
      return parts.slice(0, 4).join("/") as string;
    };
    const keys = cacheFilters.get(url());
    if (keys) {
      for (const key of keys) { 
        await this.cacheManager.del(key);
      }
      cacheFilters.delete(prefix);
    }
    cacheFilters.delete("/api/v1/dashboard");
    await this.cacheManager.del("/api/v1/dashboard");
  }
}
