import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "src/categories/category.service";
import { ProductService } from "../products.service";

@Injectable()
export class ProductMiddleware implements NestMiddleware {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  private async getCategories(categoryIds: number[]): Promise<any[]> {
    const categories = await this.categoryService.findByIds(categoryIds);
    if (!categories || categories.length !== categoryIds.length) {
      throw new NotFoundException("One or more categories not found");
    }
    return categories;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { method, body } = req;

      if (method === "POST" || method === "PUT") {
        req["categories"] = await this.getCategories(body.category_ids);
      }

      if (method === "PUT") {
        const product = await this.productService.findOne(body.id);
        if (!product) {
          throw new NotFoundException(`Product with id ${body.id} not found`);
        }
        req["product"] = product;
      }

      next();
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        return res.status(error.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
        });
      }

      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
}
