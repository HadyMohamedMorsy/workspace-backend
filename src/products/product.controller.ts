// controllers/product.controller.ts

import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
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
      resource: "product",
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.productService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "product",
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "product",
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "product",
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.productService.remove(bodyDelete.id);
  }
}
