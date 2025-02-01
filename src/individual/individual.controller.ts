import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { IndividualService } from "./individual.service";

@UseGuards(AuthorizationGuard)
@Controller("individual")
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Individual,
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
      resource: Resource.Individual,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateIndividualDto) {
    return await this.individualService.create(createProductDto);
  }

  @Post("/update")
  @EntityName("individual")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateIndividualDto) {
    return await this.individualService.update(updateProductDto);
  }

  @Delete("/delete")
  @EntityName("individual")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.individualService.remove(bodyDelete.id);
  }
}
