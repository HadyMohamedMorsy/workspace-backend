import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { Returns } from "./returns.entity";

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Returns)
    private purchasesRepository: Repository<Returns>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly productService: ProductService,
  ) {}

  // Create a new record
  async create(createReturnsDto: CreateReturnsDto): Promise<Returns> {
    const returns = this.purchasesRepository.create(createReturnsDto);
    return await this.purchasesRepository.save(returns);
  }

  // Get all records
  async findAll(filterData) {
    if (filterData.id) {
      const product = await this.productService.findOne(filterData.id);
      if (!product) {
        throw new NotFoundException("Product not found");
      }
    }

    this.apiFeaturesService.setRepository(Returns);
    const filteredRecord = filterData.id
      ? await this.apiFeaturesService.getFilteredData(filterData, {
          relations: ["product"],
          findRelated: { moduleName: "product", id: filterData.id },
        })
      : await this.apiFeaturesService.getFilteredData(filterData, {
          relations: ["product"],
        });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Returns> {
    return this.purchasesRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateReturnsDto: UpdateReturnsDto) {
    await this.purchasesRepository.update(updateReturnsDto.id, updateReturnsDto);
    return this.purchasesRepository.findOne({ where: { id: updateReturnsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.purchasesRepository.delete(id);
  }
}
