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
import { assignes_packagesService } from "./assignes-packages.service";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-package")
export class AssignesPackageController {
  constructor(private readonly assignes_packageservice: assignes_packagesService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.assignes_packageservice.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createAssignesPackageDto: CreateAssignesPackageDto, @Req() req: Request) {
    const customer = req["customer"];
    return await this.assignes_packageservice.create(createAssignesPackageDto, customer);
  }

  @Post("/update")
  @EntityName("assignesPackage")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateAssignesPackageDto: UpdateAssignesPackageDto) {
    return await this.assignes_packageservice.update(updateAssignesPackageDto);
  }

  @Delete("/delete")
  @EntityName("assignesPackage")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.assignes_packageservice.remove(bodyDelete.id);
  }
}
