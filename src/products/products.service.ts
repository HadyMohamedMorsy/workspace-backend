import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./product.entity";

@Injectable()
export class ProductService
  extends BaseService<Product, CreateProductDto, UpdateProductDto>
  implements ICrudService<Product, CreateProductDto, UpdateProductDto>
{
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto & { id: number },
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ): Promise<Product> {
    const product = updateProductDto.product;
    Object.assign(product, {
      name: updateProductDto.name,
      code: updateProductDto.code,
      selling_price: updateProductDto.selling_price,
      type: updateProductDto.type,
      store: updateProductDto.store,
      featured_image: updateProductDto.featured_image,
      categories: updateProductDto.categories,
    });

    const record = (await this.repository.save(product)) as Product & { id: number };
    return this.findOne(record.id, selectOptions, relations);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.categories", "categories")
      .addSelect(["categories.id", "categories.name"]);
  }
}
