import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { ProductService } from "src/products/products.service";

@Injectable()
export class PurchaseMiddleware implements NestMiddleware {
  constructor(private readonly productService: ProductService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { product_id, purshase_qty, type_store, purshase_price, total } = req.body;

    if (product_id) {
      const product = await this.productService.findOne(product_id);

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      if (purshase_qty <= 0) {
        throw new BadRequestException("Purchase quantity must be greater than 0");
      }

      const purshaseQty = Number(purshase_qty);

      if (isNaN(purshaseQty)) {
        throw new BadRequestException("Invalid return quantity");
      }
      const newStore =
        req.method === "DELETE" ? +product.store - purshaseQty : +product.store + purshaseQty;

      if (isNaN(newStore)) {
        throw new BadRequestException("Invalid calculation result");
      }

      product.store = newStore;
      product.purshase_price = +purshase_price;

      await this.productService.update({
        id: product.id,
        store: +newStore,
        purshase_price: +purshase_price,
      } as UpdateProductDto);

      const price = type_store === "item" ? +purshase_price : +total;
      req["purshase_price"] = +price;
      req["product"] = product;
    }

    next();
  }
}
