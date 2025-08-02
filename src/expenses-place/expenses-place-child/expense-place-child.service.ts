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

  async findExpensesPlaceChildAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      filterField: "all",
    });
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<ExpensePlaceChild>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.expensePlaceChild", "expensePlaceChild")
      .addSelect(["expensePlaceChild.id", "expensePlaceChild.name"]);

    if (filteredRecord?.expensePlace_id) {
      queryBuilder
        .leftJoin("e.expensePlace", "ep")
        .andWhere("ep.id = :expensePlace_id", {
          expensePlace_id: filteredRecord.expensePlace_id,
        })
        .addSelect(["ep.id"]);
    }

    // Add search functionality for expensePlace.name
    if (filteredRecord?.search?.value) {
      queryBuilder.orWhere("LOWER(expensePlaceChild.name) LIKE LOWER(:search)", {
        search: `%${filteredRecord.search.value}%`,
      });
    }
  }
}
