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
import { AssignesMembershipService } from "./assignes-membership.service";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-membership")
export class AssignesMembershipController {
  constructor(private readonly assignesMembershipService: AssignesMembershipService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.assignesMembershipService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.CREATE],
    },
  ])
  async create(
    @Body() createAssignesMembershipDto: CreateAssignesMembershipDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    return await this.assignesMembershipService.create(createAssignesMembershipDto, customer);
  }

  @Post("/update")
  @EntityName("assignesMembership")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateAssignesMembershipDto: UpdateAssignesMembershipDto) {
    return await this.assignesMembershipService.update(updateAssignesMembershipDto);
  }

  @Delete("/delete")
  @EntityName("assignesMembership")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.assignesMembershipService.remove(bodyDelete.id);
  }
}
