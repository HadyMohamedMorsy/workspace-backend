import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { BaseService } from "../../shared/base/base";
import { APIFeaturesService } from "../../shared/filters/filter.service";
import { ICrudService } from "../../shared/interface/crud-service.interface";
import { CreateRevenueChildDto } from "./dto/create-revenue-child.dto";
import { UpdateRevenueChildDto } from "./dto/update-revenue-child.dto";
import { RevenueChild } from "./revenue-child.entity";

@Injectable()
export class RevenueChildService
  extends BaseService<RevenueChild, CreateRevenueChildDto, UpdateRevenueChildDto>
  implements ICrudService<RevenueChild, CreateRevenueChildDto, UpdateRevenueChildDto>
{
  constructor(
    @InjectRepository(RevenueChild) repository: Repository<RevenueChild>,
    private readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(userId: number) {
    const queryBuilder = this.repository.createQueryBuilder("revenueChild");
    queryBuilder.leftJoinAndSelect("revenueChild.user", "user");
    queryBuilder.leftJoinAndSelect("revenueChild.createdBy", "createdBy");
    queryBuilder.where("revenueChild.userId = :userId", { userId });
    const [revenueChildren, total] = await queryBuilder.getManyAndCount();
    return {
      data: revenueChildren,
      total,
    };
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.revenue_child", "revenue_child")
      .addSelect(["revenue_child.id", "revenue_child.name"]);

    if (filteredRecord.revenueChild_id) {
      queryBuilder
        .leftJoin("e.revenue", "er")
        .andWhere("er.id = :revenueChild_id", {
          revenueChild_id: filteredRecord.revenueChild_id,
        })
        .addSelect(["er.id"]);
    }

    if (filteredRecord?.start_date && filteredRecord?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.start_date,
        end_date: filteredRecord.end_date,
      });
    }

    // Add search functionality for expensePlace.name
    if (filteredRecord?.search?.value) {
      queryBuilder.orWhere("LOWER(revenue_child.name) LIKE LOWER(:search)", {
        search: `%${filteredRecord.search.value}%`,
      });
    }
  }
}
