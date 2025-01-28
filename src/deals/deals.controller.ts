import { Body, Controller, Delete, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { DealsService } from "./deals.service";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@UseGuards(AuthorizationGuard)
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.dealsService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createDealsDto: CreateDealsDto) {
    return await this.dealsService.create(createDealsDto);
  }

  @Post("/update")
  async update(@Body() updateDealsDto: UpdateDealsDto) {
    return await this.dealsService.update(updateDealsDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.dealsService.remove(bodyDelete.id);
  }
}
