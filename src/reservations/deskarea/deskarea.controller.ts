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
import { DeskareaService } from "./deskarea.service";
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-returns.dto";

@UseGuards(AuthorizationGuard)
@Controller("deskarea")
export class DeskareaController {
  constructor(private readonly deskareaService: DeskareaService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findAll(filterQueryDto);
  }

  @Post("/store")
  @EntityName("desarea")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDeskareaDto: CreateDeskAreaDto) {
    return await this.deskareaService.create(createDeskareaDto);
  }

  @Post("/update")
  @EntityName("deskarea")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDeskareaDto: UpdateDeskAreaDto) {
    return await this.deskareaService.update(updateDeskareaDto);
  }

  @Delete("/delete")
  @EntityName("deskarea")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.deskareaService.remove(bodyDelete.id);
  }
}
