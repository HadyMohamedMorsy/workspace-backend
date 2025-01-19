import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensesPlaceChildService } from "./expense-place-child.service";

@Controller("expenses-child-place")
export class ExpensesPlaceChildController {
  constructor(private readonly expensesPlaceChildService: ExpensesPlaceChildService) {}

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
    return this.expensesPlaceChildService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createExpenseDto: CreateExpensePlaceChildDto) {
    return await this.expensesPlaceChildService.create(createExpenseDto);
  }

  @Post("/update")
  @EntityName("ExpensePlaceChild")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateExpenseDto: UpdateExpensePlaceChildDto) {
    return await this.expensesPlaceChildService.update(updateExpenseDto);
  }

  @Delete("/delete")
  @EntityName("ExpensePlaceChild")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.expensesPlaceChildService.remove(bodyDelete.id);
  }
}
