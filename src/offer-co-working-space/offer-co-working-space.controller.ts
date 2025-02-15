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
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateCoWorkingSpaceDto } from "./dto/create-offer-co-working-space.dto";
import { UpdateCoWorkingSpaceDto } from "./dto/update-offer-co-working-space.dto";
import { OfferCoWorkingSpaceService } from "./offer-co-working-space.service";

@UseGuards(AuthorizationGuard)
@Controller("offer-co-working-space")
export class OfferCoWorkingSpaceController {
  constructor(private readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.offerCoWorkingSpaceService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/lists",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateCoWorkingSpaceDto) {
    return await this.offerCoWorkingSpaceService.create(createProductDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/lists",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateCoWorkingSpaceDto) {
    return await this.offerCoWorkingSpaceService.update(updateProductDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/lists",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.offerCoWorkingSpaceService.remove(bodyDelete.id);
  }
}
