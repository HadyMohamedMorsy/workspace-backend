// controllers/product.controller.ts

import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
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

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Delete("/delete")
  @EntityName("Order")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
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
