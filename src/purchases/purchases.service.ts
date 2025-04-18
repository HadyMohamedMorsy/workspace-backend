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
    const newStore = (product.store || 0) + createPurchasDto.purshase_qty;
    product.store = newStore;
    product.purshase_price = this.calculatePurchasePrice(createPurchasDto);

    await this.productService.updateStore({
      id: product.id,
      store: newStore,
      purshase_price: this.calculatePurchasePrice(createPurchasDto),
    });

    const purchase = this.purchasesRepository.create({
      ...createPurchasDto,
      purshase_price: this.calculatePurchasePrice(createPurchasDto),
      product,
    });

    return await this.purchasesRepository.save(purchase);
  }

  private calculatePurchasePrice(dto: CreatePurchasDto | UpdatePurchasDto): number {
    return dto.type_store === "item" ? dto.purshase_price : dto.total;
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Purchases).buildQuery(filterData);

    if (filterData.product_id) {
      queryBuilder
        .leftJoin("e.product", "ep")
        .addSelect(["ep.id", "ep.name"])
        .andWhere("ep.id = :product_id", { product_id: filterData.product_id });
    }

    if (filterData?.customFilters?.start_date && filterData?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filterData.customFilters.start_date,
        end_date: filterData.customFilters.end_date,
      });
    }

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Purchases> {
    const purshase = await this.purchasesRepository.findOne({ where: { id } });
    if (!purshase) {
      throw new NotFoundException(`${purshase} with id ${id} not found`);
    }
    return purshase;
  }

  // Update a record
  async update(updatePurchasDto: UpdatePurchasDto) {
    const product = await this.productService.findOne(updatePurchasDto.product_id);

    if (!product) {
      throw new NotFoundException(`${product} with id ${updatePurchasDto.product_id} not found`);
    }

    if (product.store <= 0) {
      throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
    }
    if (updatePurchasDto.purshase_qty > product.store) {
      throw new BadRequestException("Return quantity exceeds available stock.");
    }

    const newStore = (product.store || 0) + updatePurchasDto.purshase_qty;
    product.store = newStore;
    product.purshase_price = this.calculatePurchasePrice(updatePurchasDto);

    await this.productService.updateStore({
      id: product.id,
      store: newStore,
      purshase_price: this.calculatePurchasePrice(updatePurchasDto),
    });

    await this.purchasesRepository.update(updatePurchasDto.id, {
      ...updatePurchasDto,
      purshase_price: this.calculatePurchasePrice(updatePurchasDto),
      product,
    });
    return this.purchasesRepository.findOne({ where: { id: updatePurchasDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.purchasesRepository.delete(id);
  }
}
