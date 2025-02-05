import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { assign_general_offerservice } from "./assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "./dto/create-assign-general-offer.dto";
import { UpdateAssignGeneralOfferDto } from "./dto/update-assign-general-offer.dto";

@UseGuards(AuthorizationGuard)
@Controller("assign-general-offer")
export class AssignGeneralOfferController {
  constructor(private readonly assign_general_offerservice: assign_general_offerservice) {}

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
    return this.assign_general_offerservice.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.CREATE],
    },
  ])
  async create(
    @Body() createAssignGeneralOfferDto: CreateAssignGeneralOfferDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];

    return await this.assign_general_offerservice.create(createAssignGeneralOfferDto, customer);
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
    return await this.assign_general_offerservice.update(updateAssignGeneralOfferDto);
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
    return this.assign_general_offerservice.remove(bodyDelete.id);
  }
}
