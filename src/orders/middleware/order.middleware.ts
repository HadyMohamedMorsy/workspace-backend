import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ProductService } from "src/products/products.service";
import { TypeOrder } from "src/shared/enum/global-enum";

@Injectable()
export class OrderMiddleware implements NestMiddleware {
  constructor(private readonly productService: ProductService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { order_items, type_order } = req.body;

    if (order_items && order_items.length > 0) {
      // Calculate totalOrder based on type_order
      const totalOrder = order_items.reduce((total, item) => {
        return total + this.getOrderItemTotalPrice(item, type_order);
      }, 0);

      // Calculate orderPrice (always based on PAID type)
      const orderPrice = order_items.reduce((total, item) => {
        return total + this.getOrderItemTotalPrice(item, TypeOrder.PAID);
      }, 0);

      const orderItems =
        order_items?.map(item => ({
          product_id: item.product?.id,
          quantity: item.quantity,
        })) || [];

      // Attach calculated values to request
      req["totalOrder"] = totalOrder;
      req["orderPrice"] = orderPrice;
      req["orderItems"] = orderItems;
    }

    next();
  }

  private getOrderItemTotalPrice(item: any, key: string): number {
    let quantity = 0;
    let accessKey = "";

    switch (key) {
      case TypeOrder.PAID:
      case TypeOrder.HOLD:
        quantity = item.quantity;
        accessKey = "selling_price";
        break;
      case TypeOrder.COST:
        quantity = item.quantity;
        accessKey = "purshase_price";
        break;
      case TypeOrder.FREE:
        quantity = 0;
        accessKey = "selling_price";
        break;
      default:
        quantity = item.quantity;
        accessKey = "selling_price";
        break;
    }
    return item.product[accessKey] * quantity;
  }
}
