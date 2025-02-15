import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core"; // To access metadata
import { Cache } from "cache-manager";
import { Observable } from "rxjs";
import { APIFeaturesService } from "../filters/filter.service";

@Injectable()
export class ClearCacheAnotherModulesIsnterceptor implements NestInterceptor {
  constructor(
    private readonly apiFeaturesService: APIFeaturesService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector, // To access custom metadata
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Get the URL from metadata (set by @ClearCache decorator)
    const urls = this.reflector.get<string[]>("clear_cache_url", context.getHandler());
    if (urls && urls.length) {
      for (const url of urls) {
        await this.clearCache(url);
      }
    }
    return next.handle();
  }

  private async clearCache(url: string): Promise<void> {
    const cacheFilters = this.apiFeaturesService.cacheFilters;
    const keys = cacheFilters.get(url);
    if (keys) {
      for (const key of keys) {
        await this.cacheManager.del(key); // Delete the cache
      }
      cacheFilters.delete(url); // Remove the URL entry from cacheFilters
    }
  }
}
