import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { Returns } from "./returns.entity";

@Injectable()
export class ReturnsService
  extends BaseService<Returns, CreateReturnsDto, UpdateReturnsDto>
  implements ICrudService<Returns, CreateReturnsDto, UpdateReturnsDto>
{
  constructor(
    readonly apiFeaturesService: APIFeaturesService,
    @InjectRepository(Returns)
    repository: Repository<Returns>,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(userId: number) {
    const queryBuilder = this.repository.createQueryBuilder("returns");
    queryBuilder.leftJoinAndSelect("returns.user", "user");
    queryBuilder.leftJoinAndSelect("returns.createdBy", "createdBy");
    queryBuilder.where("returns.userId = :userId", { userId });
    const [returns, total] = await queryBuilder.getManyAndCount();
    return {
      data: returns,
      total,
    };
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<Returns>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    if (filteredRecord.product_id) {
      queryBuilder
        .leftJoin("e.product", "ep")
        .addSelect(["ep.id", "ep.name"])
        .andWhere("ep.id = :product_id", { product_id: filteredRecord.product_id });
    }

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }
}
