// controllers/product.controller.ts

import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.companyService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreateCompanyDto) {
    return await this.companyService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdateCompanyDto) {
    return await this.companyService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.companyService.remove(bodyDelete.id);
  }
}
