import { Body, Controller, Delete, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource, TypeUser } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@UseGuards(AuthorizationGuard)
@Controller("order")
export class OrderController implements SelectOptions, RelationOptions {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("/index")
  @HttpCode(200)
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
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.ordersService.create({
      type_order: createOrderDto.type_order,
      order_number: createOrderDto.order_number,
      order_items: req["orderItems"],
      total_order: req["totalOrder"],
      orderPrice: req["orderPrice"],
      createdBy: req["createdBy"],
      [customerType]: req[customerType],
    } as CreateOrderDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() id: number) {
    await this.ordersService.delete(id);
  }

  selectOptions(): Record<string, boolean> {
    return {
      id: true,
      order_number: true,
      type_order: true,
      order_price: true,
      total_order: true,
      payment_method: true,
      order_items: true,
      created_at: true,
      updated_at: true,
    };
  }

  getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
      individual: {
        id: true,
        name: true,
        whatsApp: true,
      },
      company: {
        id: true,
        name: true,
        phone: true,
      },
      studentActivity: {
        id: true,
        name: true,
        unviresty: true,
      },
    };
  }
}
