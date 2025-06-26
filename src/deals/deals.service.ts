import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Deals } from "./deals.entity";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

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
      .leftJoin("e.room", "er")
      .addSelect(["er.id", "er.name"])
      .leftJoin("e.assignGeneralOffer", "ess")
      .addSelect(["ess.id"])
      .leftJoin("ess.generalOffer", "eg")
      .addSelect(["eg.id", "eg.type_discount", "eg.discount"])
      .leftJoin("e.deposites", "esdep")
      .addSelect(["esdep.id", "esdep.total_price", "esdep.status"])
      .leftJoin("e.individual", "ei")
      .addSelect(["ei.id", "ei.name", "ei.whatsApp", "ei.number"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.name"])
      .leftJoin("e.studentActivity", "esa")
      .addSelect(["esa.id", "esa.name"]);

    if (filteredRecord?.package) {
      switch (filteredRecord.package) {
        case "deals_active": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("e.end_date >= :currentDate", {
            currentDate: today,
          });
          break;
        }
        case "deals_expired": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("e.end_date < :currentDate", {
            currentDate: today,
          });
          break;
        }
      }
    }
  }

  async findDealsByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
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
