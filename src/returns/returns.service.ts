import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
    private returnRepository: Repository<Returns>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly productService: ProductService,
  ) {}

  // Create a new record
  async create(createReturnsDto: CreateReturnsDto): Promise<Returns> {
    const product = await this.productService.findOne(createReturnsDto.product_id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.store <= 0) {
      throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
    }
    if (createReturnsDto.return_qty > product.store) {
      throw new BadRequestException("Return quantity exceeds available stock.");
    }

    const newStore = product.store - createReturnsDto.return_qty;
    product.store = newStore;
    await this.productService.update({ id: product.id, store: newStore });

    const returns = this.returnRepository.create({
      ...createReturnsDto,
      product,
    });

    return await this.returnRepository.save(returns);
  }

  // Get all records
  async findAll(filterData) {
    if (filterData.product_id) {
      const product = await this.productService.findOne(filterData.product_id);
      if (!product) {
        throw new NotFoundException("Product not found");
      }
    }

    this.apiFeaturesService.setRepository(Returns);
    const filteredRecord = filterData.product_id
      ? await this.apiFeaturesService.getFilteredData(filterData, {
          relations: ["product"],
          findRelated: { moduleName: "product", id: filterData.product_id },
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
    return this.returnRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateReturnsDto: UpdateReturnsDto) {
    const product = await this.productService.findOne(updateReturnsDto.product_id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.store <= 0) {
      throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
    }
    if (updateReturnsDto.return_qty > product.store) {
      throw new BadRequestException("Return quantity exceeds available stock.");
    }

    const newStore = product.store - updateReturnsDto.return_qty;
    product.store = newStore;
    await this.productService.update({ id: product.id, store: newStore });

    await this.returnRepository.update(updateReturnsDto.id, {
      ...updateReturnsDto,
      product,
    });
    return this.returnRepository.findOne({ where: { id: updateReturnsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.returnRepository.delete(id);
  }
}
