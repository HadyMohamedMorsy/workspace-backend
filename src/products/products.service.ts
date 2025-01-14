import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Get all products
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Product);
    const filteredProducts = await this.apiFeaturesService.getFilteredData(filterData, {
      relations: ["categories"],
    });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredProducts,
      recordsFiltered: filteredProducts.length,
      totalRecords: +totalRecords,
    };
  }

  // Get product by ID
  async findOne(id: number): Promise<Product> {
    try {
      // Try to find the product with the given id
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        // If the product is not found, throw a NotFoundException
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Update a product
  async update(updateProductDto: UpdateProductDto) {
    await this.productRepository.update(updateProductDto.id, updateProductDto);
    return this.productRepository.findOne({ where: { id: updateProductDto.id } });
  }

  // Delete a product
  async remove(id: number) {
    await this.productRepository.delete(id);
  }
}
