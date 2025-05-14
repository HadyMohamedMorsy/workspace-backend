import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
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

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<ExpenseSalaries>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.user", "ep")
      .addSelect(["ep.id", "ep.firstName", "ep.lastName", "ep.phone"]);

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }
}
