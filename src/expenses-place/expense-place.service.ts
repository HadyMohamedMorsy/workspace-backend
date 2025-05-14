import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository } from "typeorm";
import { CreateExpensePlaceDto } from "./dto/create-expense-place.dto";
import { UpdateExpensePlaceDto } from "./dto/update-expense-place.dto";
import { ExpensePlace } from "./expense-place.entity";

@Injectable()
export class ExpensesPlaceService
  extends BaseService<ExpensePlace, CreateExpensePlaceDto, UpdateExpensePlaceDto>
  implements ICrudService<ExpensePlace, CreateExpensePlaceDto, UpdateExpensePlaceDto>
{
  constructor(
    @InjectRepository(ExpensePlace)
    repository: Repository<ExpensePlace>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }
}
