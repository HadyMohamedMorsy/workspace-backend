import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { In, Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    protected readonly apiFeaturesService: APIFeaturesService,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  // Create a new record
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(Category)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findlist() {
    const categories = await this.categoryRepository.find();
    return {
      data: categories,
    };
  }

  // Get record by ID
  async findOne(filterData: any) {
    const category = await this.categoryRepository.findOne({
      where: { id: filterData.category_id },
    });

    if (!category) {
      throw new NotFoundException(`category not exist`);
    }
    return await this.productService.getProductsRelatedCategory(filterData);
  }

  async findMany(ids: number[]): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: {
        id: In(ids),
      },
    });
    if (!categories) {
      throw new NotFoundException(`${categories} with id ${ids} not found`);
    }
    return categories;
  }

  // Update a record
  async update(updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(updateCategoryDto.id, updateCategoryDto);
    return this.categoryRepository.findOne({ where: { id: updateCategoryDto.id } });
  }

  // Delete a record
  async remove(categoryId: number) {
    await this.categoryRepository.delete(categoryId);
  }
}
