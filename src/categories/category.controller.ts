import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.categoryService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreateCategoryDto) {
    return await this.categoryService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdateCategoryDto) {
    return await this.categoryService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.categoryService.remove(bodyDelete.id);
  }
}
