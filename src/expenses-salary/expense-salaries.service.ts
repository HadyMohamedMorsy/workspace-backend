import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base-crud";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository } from "typeorm";
import { CreateExpenseSalariesDto } from "./dto/create-expense-salaries.dto";
import { UpdateExpenseSalariesDto } from "./dto/update-expense-salaries.dto";
import { ExpenseSalaries } from "./expense-salaries.entity";

@Injectable()
export class ExpensesSalariesService
  extends BaseService<ExpenseSalaries, CreateExpenseSalariesDto, UpdateExpenseSalariesDto>
  implements ICrudService<ExpenseSalaries, CreateExpenseSalariesDto, UpdateExpenseSalariesDto>
{
  constructor(
    @InjectRepository(ExpenseSalaries)
    private expensesSalariesRepository: Repository<ExpenseSalaries>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(expensesSalariesRepository, apiFeaturesService);
  }

  async findLatestByUser(userId: number): Promise<ExpenseSalaries | null> {
    return this.expensesSalariesRepository.findOne({
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }
}
