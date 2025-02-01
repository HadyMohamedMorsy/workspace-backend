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
import { AssignGeneralOfferService } from "./assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "./dto/create-assign-general-offer.dto";
import { UpdateAssignGeneralOfferDto } from "./dto/update-assign-general-offer.dto";

@UseGuards(AuthorizationGuard)
@Controller("assign-general-offer")
export class AssignGeneralOfferController {
  constructor(private readonly assignGeneralOfferService: AssignGeneralOfferService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.assignGeneralOfferService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createAssignGeneralOfferDto: CreateAssignGeneralOfferDto) {
    return await this.assignGeneralOfferService.create(createAssignGeneralOfferDto);
  }

  @Post("/update")
  @EntityName("assignGeneralOffer")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateAssignGeneralOfferDto: UpdateAssignGeneralOfferDto) {
    return await this.assignGeneralOfferService.update(updateAssignGeneralOfferDto);
  }

  @Delete("/delete")
  @EntityName("assignGeneralOffer")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.assignGeneralOfferService.remove(bodyDelete.id);
  }
}
