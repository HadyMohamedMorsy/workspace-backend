import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
  ) {}

  // Create a new record
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Category);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`${category} with id ${id} not found`);
    }
    return category;
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
