import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { BaseService } from "src/shared/base/base";
import { PRODUCT_TYPE } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { GeneralOffer } from "./generalOffer.entity";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
  filterField: string;
};

@Injectable()
export class GeneralOfferService
  extends BaseService<GeneralOffer, CreateGeneralOfferDto, UpdateGeneralOfferDto>
  implements ICrudService<GeneralOffer, CreateGeneralOfferDto, UpdateGeneralOfferDto>
{
  constructor(
    @InjectRepository(GeneralOffer)
    repository: Repository<GeneralOffer>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  private async findOffersByProductType(productType: PRODUCT_TYPE) {
    const now = moment();
    const offers = await this.repository
      .createQueryBuilder("offer")
      .where("offer.product = :productType", { productType })
      .andWhere("offer.start_date <= :now AND offer.end_date > :now", {
        now: now.toDate(),
      })
      .getMany();

    return {
      data: offers,
    };
  }

  async findShared() {
    return this.findOffersByProductType(PRODUCT_TYPE.Shared);
  }

  async findDeskArea() {
    return this.findOffersByProductType(PRODUCT_TYPE.Deskarea);
  }

  async findMembership() {
    return this.findOffersByProductType(PRODUCT_TYPE.Membership);
  }

  async findDeals() {
    return this.findOffersByProductType(PRODUCT_TYPE.Deals);
  }

  async findPackages() {
    return this.findOffersByProductType(PRODUCT_TYPE.Packages);
  }

  async findRooms() {
    return this.findOffersByProductType(PRODUCT_TYPE.Room);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoinAndSelect("e.createdBy", "createdBy");
  }

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect(`e.${relationConfig.relationPath}`, relationConfig.alias)
      .andWhere(`${relationConfig.alias}.id = :${relationConfig.filterField}`, {
        [relationConfig.filterField]: filterData[relationConfig.filterField],
      });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();
    return this.response(filteredRecord, totalRecords);
  }

  async findOneRelated(filterData: any) {
    if (filterData.individual_id) {
      return this.findRelatedEntities(filterData, {
        relationPath: "individual",
        alias: "individual",
        selectFields: ["id", "firstName", "lastName"],
        filterField: "individual_id",
      });
    }

    if (filterData.company_id) {
      return this.findRelatedEntities(filterData, {
        relationPath: "company",
        alias: "company",
        selectFields: ["id", "name"],
        filterField: "company_id",
      });
    }

    if (filterData.studentActivity_id) {
      return this.findRelatedEntities(filterData, {
        relationPath: "studentActivity",
        alias: "studentActivity",
        selectFields: ["id", "name"],
        filterField: "studentActivity_id",
      });
    }

    if (filterData.user_id) {
      return this.findRelatedEntities(filterData, {
        relationPath: "createdBy",
        alias: "user",
        selectFields: ["id", "firstName", "lastName"],
        filterField: "user_id",
      });
    }

    return this.findOne(filterData);
  }
}
