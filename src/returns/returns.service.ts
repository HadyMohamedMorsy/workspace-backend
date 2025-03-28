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
    await this.productService.updateStore({ id: product.id, store: newStore });

    const price =
      createReturnsDto.type_store === "item"
        ? createReturnsDto.return_price
        : createReturnsDto.total;

    const returns = this.returnRepository.create({
      ...createReturnsDto,
      return_price: +price,
      product,
    });

    return await this.returnRepository.save(returns);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Returns).buildQuery(filterData);

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
  async findOne(id: number): Promise<Returns> {
    const returns = await this.returnRepository.findOne({ where: { id } });
    if (!returns) {
      throw new NotFoundException(`${returns} with id ${id} not found`);
    }
    return returns;
  }

  // Update a record
  async update(updateReturnsDto: UpdateReturnsDto) {
    const product = await this.productService.findOne(updateReturnsDto.product_id);

    if (!product) {
      throw new NotFoundException(`${product} with id ${updateReturnsDto.product_id} not found`);
    }

    if (product.store <= 0) {
      throw new BadRequestException("Cannot process return. Product stock is 0 or insufficient.");
    }
    if (updateReturnsDto.return_qty > product.store) {
      throw new BadRequestException("Return quantity exceeds available stock.");
    }

    const newStore = product.store - updateReturnsDto.return_qty;
    product.store = newStore;
    await this.productService.updateStore({ id: product.id, store: newStore });

    const price =
      updateReturnsDto.type_store === "item"
        ? updateReturnsDto.return_price
        : updateReturnsDto.total;

    await this.returnRepository.update(updateReturnsDto.id, {
      ...updateReturnsDto,
      return_price: +price,
      product,
    });
    return this.returnRepository.findOne({ where: { id: updateReturnsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.returnRepository.delete(id);
  }
}
