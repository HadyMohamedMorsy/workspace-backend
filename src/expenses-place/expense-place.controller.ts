import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateExpensePlaceDto } from "./dto/create-expense-place.dto";
import { UpdateExpensePlaceDto } from "./dto/update-expense-place.dto";
import { ExpensesPlaceService } from "./expense-place.service";

@UseGuards(AuthorizationGuard)
@Controller("expenses-place")
export class ExpensesPlaceController {
  constructor(private readonly expensesPlaceService: ExpensesPlaceService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.expensesPlaceService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateExpensePlaceDto) {
    return await this.expensesPlaceService.create(createProductDto);
  }

  @Post("/update")
  @EntityName("ExpensePlace")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateExpensePlaceDto) {
    return await this.expensesPlaceService.update(updateProductDto);
  }

  @Delete("/delete")
  @EntityName("ExpensePlace")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.expensesPlaceService.remove(bodyDelete.id);
  }
}
