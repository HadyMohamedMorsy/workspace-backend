import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ProductService } from "src/products/products.service";
import { getOrderItemTotalPrice } from "../../reservations/helpers/utitlties";
import { OrdersService } from "../orders.service";
@Injectable()
export class ChangeOrderStatusMiddleware implements NestMiddleware {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id, type_order } = req.body;

    if (id) {
      const order = await this.ordersService.findOne(id, {
        id: true,
        order_items: true,
      });

      if (!order) {
        throw new NotFoundException("Order not found");
      }

      // Fetch products for all order items
      const orderItemsWithProducts = await Promise.all(
        order.order_items.map(async item => {
          const product = await this.productsService.findOne(item.product_id, {
            id: true,
            selling_price: true,
            purshase_price: true,
          });
          return {
            ...item,
            product,
          };
        }),
      );

      // Calculate new order price based on type_order
      const orderPrice = orderItemsWithProducts.reduce((total, item) => {
        return total + getOrderItemTotalPrice(item, type_order);
      }, 0);

      req["orderPrice"] = orderPrice;
    }

    next();
  }
}
