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
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersService } from "./orders.service";

@UseGuards(AuthorizationGuard)
@Controller("order")
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.ordersService.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaOrderlAll(@Body() filterQueryDto: any) {
    return this.ordersService.findOrderByIndividualAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyOrderlAll(@Body() filterQueryDto: any) {
    return this.ordersService.findOrderByComapnyAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentOrderlAll(@Body() filterQueryDto: any) {
    return this.ordersService.findOrderByStudentActivityAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findUserOrderlAll(@Body() filterQueryDto: any) {
    return this.ordersService.findOrderByUserAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules([
    "/api/v1/purchases",
    "/api/v1/returns",
    "/api/v1/category",
    "/api/v1/product",
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.ordersService.create(createOrderDto, {
      customer,
      createdBy,
    });
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/purchases",
    "/api/v1/returns",
    "/api/v1/category",
    "/api/v1/product",
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateOrderDto: UpdateOrderDto) {
    return await this.ordersService.update(updateOrderDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.ordersService.remove(bodyDelete.id);
  }
}
