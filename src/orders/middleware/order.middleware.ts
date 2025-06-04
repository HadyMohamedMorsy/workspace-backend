import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TypeOrder } from "src/shared/enum/global-enum";
import { getOrderItemTotalPrice } from "../../reservations/helpers/utitlties";

@Injectable()
export class OrderMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { order_items, type_order } = req.body;

    if (order_items && order_items.length > 0) {
      const orderPrice = order_items.reduce((total, item) => {
        return total + getOrderItemTotalPrice(item, type_order);
      }, 0);

      // Calculate orderPrice (always based on PAID type)
      const totalOrder = order_items.reduce((total, item) => {
        return total + getOrderItemTotalPrice(item, TypeOrder.PAID);
      }, 0);

      const orderItems =
        order_items?.map(item => ({
          product_id: item.product?.id,
          quantity: item.quantity,
        })) || [];

      req["totalOrder"] = totalOrder;
      req["orderPrice"] = orderPrice;
      req["orderItems"] = orderItems;
    }

    next();
  }
}
