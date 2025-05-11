import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { BaseService } from "src/shared/base/base-crud";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService
  extends BaseService<Category, CreateCategoryDto, UpdateCategoryDto>
  implements ICrudService<Category, CreateCategoryDto, UpdateCategoryDto>
{
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
    protected readonly apiFeaturesService: APIFeaturesService,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(userId: number) {
    const queryBuilder = this.repository.createQueryBuilder("category");
    queryBuilder.leftJoinAndSelect("category.createdBy", "createdBy");
    queryBuilder.where("category.createdById = :userId", { userId });
    const [categories, total] = await queryBuilder.getManyAndCount();
    return {
      data: categories,
      total,
    };
  }
}
