import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateExpenseSalariesDto } from "./dto/create-expense-salaries.dto";
import { UpdateExpenseSalariesDto } from "./dto/update-expense-salaries.dto";
import { ExpenseSalaries } from "./expense-salaries.entity";
import * as moment from "moment-timezone";

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
      relations: ["user"],
      where: { user: { id: userId } },
      order: { created_at: "DESC" },
    });
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ExpenseSalaries)
      .buildQuery(filterData);

    queryBuilder.andWhere("ec.id = :user_id", { user_id: filterData.user_id });
    this.queryRelationIndex(queryBuilder);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();
    return this.response(filteredRecord, totalRecords);
  }

  async findExpensesSalariesAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      filterField: "all",
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

    if (filteredRecord?.start_date && filteredRecord?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: moment(filteredRecord.start_date).format("YYYY-MM-DD"),
        end_date: moment(filteredRecord.end_date).format("YYYY-MM-DD"),
      });
    }
  }
}
