import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { ReturnsService } from "./returns.service";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.returnsService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreateReturnsDto) {
    return await this.returnsService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdateReturnsDto) {
    return await this.returnsService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.returnsService.remove(bodyDelete.id);
  }
}
