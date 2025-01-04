import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { Permission } from "src/users/enum/permissions-enum";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { IndividualService } from "./individual.service";

@Controller("individual")
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: "studentActivity",
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.individualService.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: "individual",
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateIndividualDto) {
    return await this.individualService.create(createProductDto);
  }

  @Post("/update")
  @Permissions([
    {
      resource: "individual",
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateIndividualDto) {
    return await this.individualService.update(updateProductDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: "individual",
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.individualService.remove(bodyDelete.id);
  }
}
