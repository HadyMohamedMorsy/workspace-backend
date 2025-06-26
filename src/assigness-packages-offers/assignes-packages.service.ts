import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { AssignesPackages } from "./assignes-packages.entity";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@Injectable()
export class AssignesPackagesService
  extends BaseService<AssignesPackages, CreateAssignesPackageDto, UpdateAssignesPackageDto>
  implements ICrudService<AssignesPackages, CreateAssignesPackageDto, UpdateAssignesPackageDto>
{
  constructor(
    @InjectRepository(AssignesPackages)
    repository: Repository<AssignesPackages>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.packages", "ep")
      .addSelect(["ep.id", "ep.name", "ep.hours", "ep.price", "ep.room"])
      .leftJoin("ep.room", "epr")
      .addSelect(["epr.id", "epr.name"])
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
        case "packages_active": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("e.end_date >= :currentDate", {
            currentDate: today,
          });
          break;
        }
        case "packages_expired": {
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

  async findAssignesByUser(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }

  async findAssignesByIndividual(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
      filterField: "individual_id",
    });
  }

  async findAssignesByCompany(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name"],
      filterField: "company_id",
    });
  }

  async findAssignesByStudentActivity(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name"],
      filterField: "studentActivity_id",
    });
  }
}
