import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@UseGuards(AuthorizationGuard)
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.categoryService.findAll(filterQueryDto);
  }

  @Get("/list-categories")
  @UseInterceptors(CachingInterceptor)
  async findList() {
    return this.categoryService.findlist();
  }

  @Post("/show")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.VIEW],
    },
  ])
  async findRelList(@Body() filterQueryDto: any) {
    return this.categoryService.findOne(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateCategoryDto) {
    return await this.categoryService.create(createProductDto);
  }

  @Post("/update")
  @EntityName("category")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateCategoryDto) {
    return await this.categoryService.update(updateProductDto);
  }

  @Delete("/delete")
  @EntityName("category")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.categoryService.remove(bodyDelete.id);
  }
}
