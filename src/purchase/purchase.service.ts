import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base-crud";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { Purchase } from "./purchase.entity";

@Injectable()
export class PurchaseService
  extends BaseService<Purchase, CreatePurchaseDto, UpdatePurchaseDto>
  implements ICrudService<Purchase, CreatePurchaseDto, UpdatePurchaseDto>
{
  constructor(
    readonly apiFeaturesService: APIFeaturesService,
    @InjectRepository(Purchase)
    repository: Repository<Purchase>,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(userId: number) {
    const queryBuilder = this.repository.createQueryBuilder("purchase");
    queryBuilder.leftJoinAndSelect("purchase.user", "user");
    queryBuilder.leftJoinAndSelect("purchase.createdBy", "createdBy");
    queryBuilder.where("purchase.userId = :userId", { userId });
    const [purchases, total] = await queryBuilder.getManyAndCount();
    return {
      data: purchases,
      total,
    };
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<Purchase>, filteredRecord?: any) {
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
