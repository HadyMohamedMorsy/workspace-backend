import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ProductService } from "src/products/products.service";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersService } from "./orders.service";

@UseGuards(AuthorizationGuard)
@Controller("order")
export class OrderController implements SelectOptions, RelationOptions {
  constructor(
    private readonly service: OrdersService,
    private readonly productService: ProductService,
  ) {}

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
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
    return this.service.findOrderByIndividualAll(filterQueryDto);
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
    return this.service.findOrderByComapnyAll(filterQueryDto);
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
    return this.service.findOrderByStudentActivityAll(filterQueryDto);
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
    return this.service.findOrderByUserAll(filterQueryDto);
  }

  @Get("/show/:id")
  async getOrderById(@Param("id") id: number) {
    const order = await this.service.findOne(id, {
      id: true,
      order_number: true,
      type_order: true,
      order_price: true,
      total_order: true,
      payment_method: true,
      order_items: true,
      created_at: true,
      updated_at: true,
    });

    if (!order) {
      return null;
    }

    // Get product details for each order item
    const orderItemsWithProducts = await Promise.all(
      order.order_items.map(async item => {
        const product = await this.productService.findOne(item.product_id, {
          id: true,
          name: true,
          code: true,
          selling_price: true,
          store: true,
          featured_image: true,
        });
        return {
          product,
          quantity: item.quantity,
        };
      }),
    );

    return {
      ...order,
      order_items: orderItemsWithProducts,
    };
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return await this.service.create({
      order_number: createOrderDto.order_number,
      order_items: req["orderItems"],
      type_order: createOrderDto.type_order,
      total_order: req["totalOrder"],
      order_price: req["orderPrice"],
      createdBy: req["createdBy"],
      individual: req["individual"],
      company: req["company"],
      studentActivity: req["studentActivity"],
      user: req["user"],
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
    await this.service.delete(id);
  }

  @Patch("/change-type-order-status")
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; type_order: string }, @Req() req: Request) {
    return this.service.changeStatus(
      update.id,
      update.type_order,
      "type_order",
      {
        id: true,
        type_order: true,
        order_price: true,
      },
      {
        order_price: req["orderPrice"],
      },
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.Order,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
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
