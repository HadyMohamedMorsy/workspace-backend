import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "src/categories/category.service";
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
    protected readonly categoryService: CategoryService,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const categories = await this.categoryService.findMany(createProductDto.category_ids);

    if (!categories) {
      // If the product is not found, throw a NotFoundException
      throw new NotFoundException(`categories with id ${createProductDto.category_ids} not found`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      categories,
    });
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
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`${product} with id ${id} not found`);
    }
    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    await this.productRepository.update(updateProductDto.id, updateProductDto);
    return this.productRepository.findOne({ where: { id: updateProductDto.id } });
  }

  async updateWithManyRelation(updateProductDto: UpdateProductDto) {
    const categories = await this.categoryService.findMany(updateProductDto.category_ids);

    if (!categories) {
      // If the product is not found, throw a NotFoundException
      throw new NotFoundException(`categories with id ${updateProductDto.category_ids} not found`);
    }

    const existingProduct = await this.findOne(updateProductDto.id);

    existingProduct.categories = categories;
    existingProduct.name = updateProductDto.name;
    existingProduct.code = updateProductDto.code;
    existingProduct.selling_price = updateProductDto.selling_price;
    existingProduct.store = updateProductDto.store;
    existingProduct.featured_image = updateProductDto.featured_image;

    return await this.productRepository.save(existingProduct);
  }

  // Delete a product
  async remove(productId: number) {
    await this.productRepository.delete(productId);
  }
}
