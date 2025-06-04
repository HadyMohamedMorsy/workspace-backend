import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateVacationDto } from "./dto/create-vacation.dto";
import { UpdateVacationDto } from "./dto/update-vacation.dto";
import { Vacation } from "./vacation.entity";

@Injectable()
export class VacationService
  extends BaseService<Vacation, CreateVacationDto, UpdateVacationDto>
  implements ICrudService<Vacation, CreateVacationDto, UpdateVacationDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(Vacation)
    repository: Repository<Vacation>,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(filterData) {
    const queryBuilder = this.apiService.setRepository(Vacation).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "ec")
      .leftJoin("e.createdBy", "eu")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoinAndSelect("e.user", "eu")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);
  }
}
