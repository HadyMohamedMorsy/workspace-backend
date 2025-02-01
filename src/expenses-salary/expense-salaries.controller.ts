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
import { CreateExpenseSalariesDto } from "./dto/create-expense-salaries.dto";
import { UpdateExpenseSalariesDto } from "./dto/update-expense-salaries.dto";
import { ExpensesSalariesService } from "./expense-salaries.service";

@UseGuards(AuthorizationGuard)
@Controller("salary")
export class ExpensesSalariesController {
  constructor(private readonly expensesSalariesService: ExpensesSalariesService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.expensesSalariesService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateExpenseSalariesDto) {
    return await this.expensesSalariesService.create(createProductDto);
  }

  @Post("/update")
  @EntityName("ExpenseSalaries")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateExpenseSalariesDto) {
    return await this.expensesSalariesService.update(updateProductDto);
  }

  @Delete("/delete")
  @EntityName("ExpenseSalaries")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.expensesSalariesService.remove(bodyDelete.id);
  }
}
