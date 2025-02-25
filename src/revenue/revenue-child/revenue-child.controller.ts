import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateRevenueChildDto } from "./dto/create-revenue-child.dto";
import { UpdateRevenueChildDto } from "./dto/update-revenue-child.dto";
import { RevenueChildService } from "./revenue-child.service";

@UseGuards(AuthorizationGuard)
@Controller("revenue-child")
export class RevenueChildController {
  constructor(private readonly revenueChildService: RevenueChildService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.revenueChildService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/revenue-place"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createRevenueDto: CreateRevenueChildDto) {
    return await this.revenueChildService.create(createRevenueDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules(["/api/v1/revenue-place"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateRevenueDto: UpdateRevenueChildDto) {
    return await this.revenueChildService.update(updateRevenueDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.revenueChildService.remove(bodyDelete.id);
  }
}
