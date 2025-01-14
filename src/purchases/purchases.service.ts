import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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
    const product = await this.productService.findOne(createPurchasDto.product_id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const newStore = (product.store || 0) + createPurchasDto.purchase_qty;
    product.store = newStore;
    await this.productService.update({ id: product.id, store: newStore });

    const purchase = this.purchasesRepository.create({
      ...createPurchasDto,
      product,
    });

    return await this.purchasesRepository.save(purchase);
  }

  // Get all records
  async findAll(filterData) {
    if (filterData.product_id) {
      const product = await this.productService.findOne(filterData.product_id);
      if (!product) {
        throw new NotFoundException("Product not found");
      }
    }

    this.apiFeaturesService.setRepository(Purchases);
    const filteredRecord = filterData.id
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
  async findOne(id: number): Promise<Purchases> {
    return this.purchasesRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updatePurchasDto: UpdatePurchasDto) {
    const product = await this.productService.findOne(updatePurchasDto.product_id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.store <= 0) {
      throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
    }
    if (updatePurchasDto.purchase_qty > product.store) {
      throw new BadRequestException("Return quantity exceeds available stock.");
    }

    const newStore = (product.store || 0) + updatePurchasDto.purchase_qty;
    product.store = newStore;
    await this.productService.update({ id: product.id, store: newStore });

    await this.purchasesRepository.update(updatePurchasDto.id, {
      ...updatePurchasDto,
      product,
    });
    return this.purchasesRepository.findOne({ where: { id: updatePurchasDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.purchasesRepository.delete(id);
  }
}
