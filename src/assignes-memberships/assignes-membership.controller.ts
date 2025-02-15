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
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignesMembershipService } from "./assignes-membership.service";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-membership")
export class AssignesMembershipController {
  constructor(private readonly assignesMembershipService: AssignesMembershipService) {}

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesMembershipService.findAssignesByIndividual(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesMembershipService.findAssignesByCompany(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesMembershipService.findAssignesByStudentActivity(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findUserAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesMembershipService.findAssignesByUser(filterQueryDto);
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
    const createdBy = req["createdBy"];
    return await this.assignesMembershipService.create(createAssignesMembershipDto, {
      customer,
      createdBy,
    });
  }

  @Post("/update")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
