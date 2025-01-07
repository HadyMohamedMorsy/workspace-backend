// controllers/product.controller.ts

import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: "company",
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.companyService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "company",
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateCompanyDto) {
    return await this.companyService.create(createProductDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "company",
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateCompanyDto) {
    return await this.companyService.update(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "company",
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.companyService.remove(bodyDelete.id);
  }
}
