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

  @Post("/user")
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.individualService.findByUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateIndividualDto, @Req() req: Request) {
    const payload = { ...createProductDto, createdBy: req["createdBy"] };
    return await this.individualService.create(payload);
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
  async update(@Body() updateProductDto: UpdateIndividualDto, @Req() req: Request) {
    const payload = { ...updateProductDto, createdBy: req["createdBy"] };
    return await this.individualService.update(payload);
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
