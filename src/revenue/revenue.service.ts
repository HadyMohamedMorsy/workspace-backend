import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { UpdateRevenueDto } from "./dto/update-revenue.dto";
import { Revenue } from "./revenue.entity";

@Injectable()
export class RevenueService
  extends BaseService<Revenue, CreateRevenueDto, UpdateRevenueDto>
  implements ICrudService<Revenue, CreateRevenueDto, UpdateRevenueDto>
{
  constructor(
    readonly apiFeaturesService: APIFeaturesService,
    @InjectRepository(Revenue)
    repository: Repository<Revenue>,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(userId: number) {
    const queryBuilder = this.repository.createQueryBuilder("revenue");
    queryBuilder.leftJoinAndSelect("revenue.user", "user");
    queryBuilder.leftJoinAndSelect("revenue.createdBy", "createdBy");
    queryBuilder.where("revenue.userId = :userId", { userId });
    const [revenues, total] = await queryBuilder.getManyAndCount();
    return {
      data: revenues,
      total,
    };
  }
}
