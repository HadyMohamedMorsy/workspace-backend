import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UpdateProductDto } from "src/products/dto/update-product.dto";
import { ProductService } from "src/products/products.service";

@Injectable()
export class PurchaseMiddleware implements NestMiddleware {
  constructor(private readonly productService: ProductService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { product_id, purchase_qty, type_store, purchase_price, total } = req.body;

    if (product_id) {
      const product = await this.productService.findOne(product_id);

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      if (purchase_qty <= 0) {
        throw new BadRequestException("Purchase quantity must be greater than 0");
      }

      const newStore = product.store + purchase_qty;
      product.store = newStore;
      await this.productService.update({ id: product.id, store: newStore } as UpdateProductDto);

      // Calculate price based on type_store
      const price = type_store === "item" ? purchase_price : total;
      req["purchase_price"] = +price;
      req["product"] = product;
    }

    next();
  }
}
