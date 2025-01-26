import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { GeneralOfferService } from "./generalOffer.service";

@Controller("general-offer")
export class GeneralOfferController {
  constructor(private readonly generalOfferService: GeneralOfferService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.generalOfferService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateGeneralOfferDto) {
    return await this.generalOfferService.create(createProductDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateGeneralOfferDto) {
    return await this.generalOfferService.update(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.generalOfferService.remove(bodyDelete.id);
  }
}
