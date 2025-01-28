import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreatePurchasDto } from "./dto/create-purchases.dto";
import { UpdatePurchasDto } from "./dto/update-purchases.dto";
import { PurchasesService } from "./purchases.service";

@UseGuards(AuthorizationGuard)
@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.purchasesService.findAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category", "/api/v1/dashboard"])
  @EntityName("product", "product_id")
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreatePurchasDto) {
    return await this.purchasesService.create(createProductDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category", "/api/v1/dashboard"])
  @EntityName("Purchases")
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdatePurchasDto) {
    return await this.purchasesService.update(updateProductDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModules(["/api/v1/product", "/api/v1/category"])
  @EntityName("Purchases")
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.DELETE],
    },
  ])
  @UseInterceptors(
    DeleteCacheInterceptor,
    ClearCacheAnotherModulesIsnterceptor,
    EntityIsExistInterceptor,
  )
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.purchasesService.remove(bodyDelete.id);
  }
}
