import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSettingsService } from "src/general-settings/settings.service";
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
    private readonly generalSettingsService: GeneralSettingsService,
  ) {
    super(repository, apiFeaturesService);
  }

  async updateProduct(
    updateProductDto: UpdateProductDto & { product: Product },
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

  override async queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.categories", "categories")
      .addSelect(["categories.id", "categories.name"]);

    // Handle stock filtering based on filteredRecord.is_store
    if (filteredRecord?.is_store) {
      switch (filteredRecord.is_store) {
        case "stock":
          queryBuilder.andWhere("e.store > 0");
          break;
        case "out_of_stock":
          queryBuilder.andWhere("e.store = 0");
          break;
        case "alert_of_stock":
          const settings = await this.generalSettingsService.findAll({});
          const alertStoreThreshold = settings[0]?.alert_store || 0;
          queryBuilder.andWhere("e.store < :alertStoreThreshold", { alertStoreThreshold });
          break;
      }
    }
  }

  protected override async response(data: Product[], totalRecords: number = 0): Promise<any> {
    const settings = await this.generalSettingsService.findAll({});

    const productsWithAlert = data.map(product => ({
      ...product,
      is_alert_store: product.store < (+settings[0]?.alert_store || 0),
    }));

    return {
      data: productsWithAlert,
      recordsFiltered: productsWithAlert.length,
      totalRecords: +totalRecords,
    };
  }

  async getProductsByCategory(
    category_id: number,
    search?: string,
    start: number = 0,
    length: number = 10,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder("product")
      .select([
        "product.id",
        "product.name",
        "product.store",
        "product.selling_price",
        "product.purshase_price",
        "product.featured_image",
      ]);

    if (search) {
      queryBuilder.where("product.name ILIKE :search", { search: `%${search}%` });
    } else {
      queryBuilder
        .leftJoin("product.categories", "categories")
        .where("categories.id = :categoryId", { categoryId: category_id });
    }

    const filteredRecord = await queryBuilder.skip(start).take(length).getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }
}
