import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./products.service";

@UseGuards(AuthorizationGuard)
@Controller("products")
export class ProductController implements SelectOptions, RelationOptions {
  constructor(private readonly service: ProductService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      code: true,
      name: true,
      type: true,
      store: true,
      selling_price: true,
      purshase_price: true,
      featured_image: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
      categories: {
        id: true,
        name: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateProductDto, @Req() req: Request) {
    return await this.service.create(
      {
        code: create.code,
        name: create.name,
        featured_image: create.featured_image,
        type: create.type,
        store: create.store,
        selling_price: create.selling_price,
        purshase_price: create.purshase_price,
        categories: req["categories"],
        createdBy: req["createdBy"],
      } as CreateProductDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateProductDto, @Req() req: Request) {
    return await this.service.updateProduct(
      {
        id: update.id,
        code: update.code,
        name: update.name,
        featured_image: update.featured_image,
        type: update.type,
        store: update.store,
        selling_price: update.selling_price,
        purshase_price: update.purshase_price,
        product: req["product"],
        categories: req["categories"],
        createdBy: req["createdBy"],
      } as UpdateProductDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Product,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
