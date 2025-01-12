import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CreatePurchasDto } from "./dto/create-purchases.dto";
import { UpdatePurchasDto } from "./dto/update-purchases.dto";
import { PurchasesService } from "./purchases.service";

@Controller("purchases")
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.purchasesService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreatePurchasDto) {
    return await this.purchasesService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdatePurchasDto) {
    return await this.purchasesService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.purchasesService.remove(bodyDelete.id);
  }
}
