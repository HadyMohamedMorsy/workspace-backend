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
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DealsService } from "./deals.service";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@UseGuards(AuthorizationGuard)
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaDealsAll(@Body() filterQueryDto: any) {
    return this.dealsService.findDealsByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentDealsAll(@Body() filterQueryDto: any) {
    return this.dealsService.findDealsByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDealsAll(@Body() filterQueryDto: any) {
    return this.dealsService.findDealsByComapnyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findUserDealsAll(@Body() filterQueryDto: any) {
    return this.dealsService.findDealsByUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDealsDto: CreateDealsDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.dealsService.create(createDealsDto, {
      customer,
      createdBy,
    });
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDealsDto: UpdateDealsDto) {
    return await this.dealsService.update(updateDealsDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.dealsService.remove(bodyDelete.id);
  }
}
