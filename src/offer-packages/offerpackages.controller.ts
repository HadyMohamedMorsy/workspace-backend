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
import { CreateOfferPackagesDto } from "./dto/create-offer-packages.dto";
import { UpdateOfferPackagesDto } from "./dto/update-offer-packages.dto";
import { OfferPackagesService } from "./offerpackages.service";

@UseGuards(AuthorizationGuard)
@Controller("packages")
export class OfferPackagesController {
  constructor(private readonly offerpackagesService: OfferPackagesService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.OfferPackages,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.offerpackagesService.findAll(filterQueryDto);
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
      resource: Resource.OfferPackages,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createPackageDto: CreateOfferPackagesDto) {
    return await this.offerpackagesService.create(createPackageDto);
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
      resource: Resource.OfferPackages,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updatePackageDto: UpdateOfferPackagesDto) {
    return await this.offerpackagesService.update(updatePackageDto);
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
      resource: Resource.OfferPackages,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.offerpackagesService.remove(bodyDelete.id);
  }
}
