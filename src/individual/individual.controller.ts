import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { IndividualService } from "./individual.service";

@Controller("individual")
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
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
  @UseInterceptors(DeleteCacheInterceptor)
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
  @UseInterceptors(DeleteCacheInterceptor)
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
  @UseInterceptors(DeleteCacheInterceptor)
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
