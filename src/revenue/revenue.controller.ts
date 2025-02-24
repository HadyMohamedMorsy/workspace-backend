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
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { UpdateRevenueDto } from "./dto/update-revenue.dto";
import { RevenueService } from "./revenue.service";

@UseGuards(AuthorizationGuard)
@Controller("revenue")
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.revenueService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createRevenueDto: CreateRevenueDto) {
    return await this.revenueService.create(createRevenueDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateRevenueDto: UpdateRevenueDto) {
    return await this.revenueService.update(updateRevenueDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.revenueService.remove(bodyDelete.id);
  }
}
