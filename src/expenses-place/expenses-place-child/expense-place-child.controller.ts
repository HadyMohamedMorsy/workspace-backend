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
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensesPlaceChildService } from "./expense-place-child.service";

@UseGuards(AuthorizationGuard)
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
  @ClearCacheAnotherModules(["/api/v1/expenses-place"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules(["/api/v1/expenses-place"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @UseInterceptors(DeleteCacheInterceptor)
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
