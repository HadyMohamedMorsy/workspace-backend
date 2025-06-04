import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateCoWorkingSpaceDto } from "./dto/create-offer-co-working-space.dto";
import { UpdateCoWorkingSpaceDto } from "./dto/update-offer-co-working-space.dto";
import { CoWorkingSpace } from "./offer-co-working-space.entity";

@Injectable()
export class OfferCoWorkingSpaceService
  extends BaseService<CoWorkingSpace, CreateCoWorkingSpaceDto, UpdateCoWorkingSpaceDto>
  implements ICrudService<CoWorkingSpace, CreateCoWorkingSpaceDto, UpdateCoWorkingSpaceDto>
{
  constructor(
    @InjectRepository(CoWorkingSpace)
    repository: Repository<CoWorkingSpace>,
    apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<CoWorkingSpace>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoin("e.assignessMemebership", "em").addSelect(["em.id"]);
  }
}
