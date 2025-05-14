import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Deals } from "./deals.entity";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
  filterField: string;
};

@Injectable()
export class DealsService
  extends BaseService<Deals, CreateDealsDto, UpdateDealsDto>
  implements ICrudService<Deals, CreateDealsDto, UpdateDealsDto>
{
  constructor(
    @InjectRepository(Deals)
    repository: Repository<Deals>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoinAndSelect("e.room", "er")
      .leftJoinAndSelect("e.assignGeneralOffer", "ess")
      .leftJoinAndSelect("ess.generalOffer", "eg")
      .leftJoinAndSelect("e.deposites", "esdep");
  }

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

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

  async findDealsByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "individual_id",
    });
  }

  async findDealsByComapnyAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name"],
      filterField: "company_id",
    });
  }

  async findDealsByStudentActivityAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name"],
      filterField: "studentActivity_id",
    });
  }

  async findDealsByUserAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }
}
