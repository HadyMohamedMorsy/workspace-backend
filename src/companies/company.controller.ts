// controllers/product.controller.ts

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
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
@UseGuards(AuthorizationGuard)
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.companyService.findAll(filterQueryDto);
  }

  @Post("/user")
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.companyService.findByUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: Request) {
    const payload = { ...createCompanyDto, createdBy: req["createdBy"] };
    return await this.companyService.create(payload);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateCompanyDto: UpdateCompanyDto, @Req() req: Request) {
    const payload = { ...updateCompanyDto, createdBy: req["createdBy"] };
    return await this.companyService.update(payload);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.companyService.remove(bodyDelete.id);
  }
}
