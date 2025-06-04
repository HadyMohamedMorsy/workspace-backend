import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ExpensesPlaceService } from "../expense-place.service";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensePlaceChild } from "./expense-place-child.entity";

@Injectable()
export class ExpensesPlaceChildService
  extends BaseService<ExpensePlaceChild, CreateExpensePlaceChildDto, UpdateExpensePlaceChildDto>
  implements ICrudService<ExpensePlaceChild, CreateExpensePlaceChildDto, UpdateExpensePlaceChildDto>
{
  constructor(
    @InjectRepository(ExpensePlaceChild)
    repository: Repository<ExpensePlaceChild>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly expenseService: ExpensesPlaceService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<ExpensePlaceChild>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    if (filteredRecord.expensePlace_id) {
      queryBuilder.leftJoin("e.expensePlace", "ep").andWhere("ep.id = :expenseplace_id", {
        expenseplace_id: filteredRecord.expensePlace_id,
      });
    }
    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }
}
