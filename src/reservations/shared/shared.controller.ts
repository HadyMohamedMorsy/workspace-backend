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
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { SharedService } from "./shared.service";

@UseGuards(AuthorizationGuard)
@Controller("shared")
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.sharedService.findAll(filterQueryDto);
  }

  @Post("/store")
  @EntityName("shared")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createSharedDto: CreateSharedDto) {
    return await this.sharedService.create(createSharedDto);
  }

  @Post("/update")
  @EntityName("shared")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateSharedDto: UpdateSharedDto) {
    return await this.sharedService.update(updateSharedDto);
  }

  @Delete("/delete")
  @EntityName("shared")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.sharedService.remove(bodyDelete.id);
  }
}
