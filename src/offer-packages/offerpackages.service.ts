import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateOfferPackagesDto } from "./dto/create-offer-packages.dto";
import { UpdateOfferPackagesDto } from "./dto/update-offer-packages.dto";
import { OfferPackages } from "./offer-package.entity";

@Injectable()
export class OfferPackagesService
  extends BaseService<OfferPackages, CreateOfferPackagesDto, UpdateOfferPackagesDto>
  implements ICrudService<OfferPackages, CreateOfferPackagesDto, UpdateOfferPackagesDto>
{
  constructor(
    @InjectRepository(OfferPackages)
    repository: Repository<OfferPackages>,
    apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<OfferPackages>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoin("e.room", "er").addSelect(["er.id", "er.name"]);
  }
}
