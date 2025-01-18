import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { ReturnsService } from "./returns.service";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.returnsService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category"])
  @EntityName("product", "product_id")
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateReturnsDto) {
    return await this.returnsService.create(createProductDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category"])
  @EntityName("returns")
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateReturnsDto) {
    return await this.returnsService.update(updateProductDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category"])
  @EntityName("returns")
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.returnsService.remove(bodyDelete.id);
  }
}
