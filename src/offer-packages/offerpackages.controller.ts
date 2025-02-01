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
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
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
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @EntityName("room", "room_id")
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
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @EntityName("room", "room_id")
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
  @UseInterceptors(DeleteCacheInterceptor)
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
