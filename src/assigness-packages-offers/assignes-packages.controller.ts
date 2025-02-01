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
import { AssignesPackagesService } from "./assignes-packages.service";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-package")
export class AssignesPackageController {
  constructor(private readonly assignesPackageService: AssignesPackagesService) {}

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
    return this.assignesPackageService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createAssignesPackageDto: CreateAssignesPackageDto) {
    return await this.assignesPackageService.create(createAssignesPackageDto);
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
    return await this.assignesPackageService.update(updateAssignesPackageDto);
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
    return this.assignesPackageService.remove(bodyDelete.id);
  }
}
