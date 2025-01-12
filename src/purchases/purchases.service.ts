import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreatePurchasDto } from "./dto/create-purchases.dto";
import { UpdatePurchasDto } from "./dto/update-purchases.dto";
import { Purchases } from "./purchases.entity";

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchases)
    private purchasesRepository: Repository<Purchases>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly productService: ProductService,
  ) {}

  // Create a new record
  async create(createPurchasDto: CreatePurchasDto): Promise<Purchases> {
    const purchases = this.purchasesRepository.create(createPurchasDto);
    return await this.purchasesRepository.save(purchases);
  }

  // Get all records
  async findAll(filterData) {
    const product = await this.productService.findOne(filterData.id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    this.apiFeaturesService.setRepository(Purchases);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData, {
      relations: ["product"],
      findRelated: { moduleName: "product", id: filterData.id },
    });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Purchases> {
    return this.purchasesRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updatePurchasDto: UpdatePurchasDto) {
    await this.purchasesRepository.update(updatePurchasDto.id, updatePurchasDto);
    return this.purchasesRepository.findOne({ where: { id: updatePurchasDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.purchasesRepository.delete(id);
  }
}
