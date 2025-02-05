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
import { AssignGeneralOfferservice } from "./assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "./dto/create-assign-general-offer.dto";
import { UpdateAssignGeneralOfferDto } from "./dto/update-assign-general-offer.dto";

@UseGuards(AuthorizationGuard)
@Controller("assign-general-offer")
export class AssignGeneralOfferController {
  constructor(private readonly AssignGeneralOfferservice: AssignGeneralOfferservice) {}

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
    return this.AssignGeneralOfferservice.findAll(filterQueryDto);
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

    return await this.AssignGeneralOfferservice.create(createAssignGeneralOfferDto, customer);
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
    return await this.AssignGeneralOfferservice.update(updateAssignGeneralOfferDto);
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
    return this.AssignGeneralOfferservice.remove(bodyDelete.id);
  }
}
