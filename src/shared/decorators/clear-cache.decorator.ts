import { SetMetadata } from "@nestjs/common";

export const CLEAR_CACHE_URL = "clear_cache_url";

// This decorator will be used to pass the URL
export const ClearCacheAnotherModules = (urls: string[]) => SetMetadata(CLEAR_CACHE_URL, urls);
