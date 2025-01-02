import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { IndividualService } from "./individual.service";

@Controller("individual")
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.individualService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreateIndividualDto) {
    return await this.individualService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdateIndividualDto) {
    return await this.individualService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.individualService.remove(bodyDelete.id);
  }
}
