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
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./products.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.productService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules([
    "/api/v1/purchases",
    "/api/v1/returns",
    "/api/v1/category",
    "/api/v1/dashboard",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/purchases",
    "/api/v1/returns",
    "/api/v1/category",
    "/api/v1/dashboard",
  ])
  @EntityName("product")
  @UseInterceptors(
    DeleteCacheInterceptor,
    EntityIsExistInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
  )
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateProductDto) {
    return await this.productService.updateWithManyRelation(updateProductDto);
  }

  @Delete("/delete")
  @EntityName("product")
  @ClearCacheAnotherModules(["/api/v1/purchases", "/api/v1/returns", "/api/v1/category"])
  @UseInterceptors(
    DeleteCacheInterceptor,
    EntityIsExistInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
  )
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.productService.remove(bodyDelete.id);
  }
}
