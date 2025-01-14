import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { ClearCacheAnotherModule } from "src/shared/decorators/clear-cache.decorator";
import { ClearCacheAnotherModuleInterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { ReturnsService } from "./returns.service";

@Controller("returns")
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.returnsService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @ClearCacheAnotherModule("/api/v1/product")
  @UseInterceptors(ClearCacheAnotherModuleInterceptor)
  async create(@Body() createProductDto: CreateReturnsDto) {
    return await this.returnsService.create(createProductDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @ClearCacheAnotherModule("/api/v1/product")
  @UseInterceptors(ClearCacheAnotherModuleInterceptor)
  async update(@Body() updateProductDto: UpdateReturnsDto) {
    return await this.returnsService.update(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @ClearCacheAnotherModule("/api/v1/product")
  @UseInterceptors(ClearCacheAnotherModuleInterceptor)
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.returnsService.remove(bodyDelete.id);
  }
}
