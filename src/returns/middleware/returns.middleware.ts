import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { ProductService } from "src/products/products.service";

@Injectable()
export class ReturnsMiddleware implements NestMiddleware {
  constructor(private readonly productService: ProductService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { product_id, return_qty, type_store, return_price, total } = req.body;

    if (product_id) {
      const product = await this.productService.findOne(product_id);

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      if (product.store <= 0) {
        throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
      }

      if (return_qty > product.store) {
        throw new BadRequestException("Return quantity exceeds available stock.");
      }

      const newStore = product.store - return_qty;
      product.store = newStore;
      await this.productService.update({ id: product.id, store: newStore } as UpdateProductDto);

      // Calculate price based on type_store
      const price = type_store === "item" ? return_price : total;
      req["return_price"] = +price;
      req["product"] = product;
    }

    next();
  }
}
