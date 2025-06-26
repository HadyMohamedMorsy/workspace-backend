import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { AssignesMembership } from "./assignes-membership.entity";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@Injectable()
export class AssignesMembershipService
  extends BaseService<AssignesMembership, CreateAssignesMembershipDto, UpdateAssignesMembershipDto>
  implements
    ICrudService<AssignesMembership, CreateAssignesMembershipDto, UpdateAssignesMembershipDto>
{
  constructor(
    @InjectRepository(AssignesMembership)
    repository: Repository<AssignesMembership>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.memeberShip", "em")
      .addSelect(["em.id", "em.name", "em.price", "em.days", "em.type"])
      .leftJoin("e.shared", "es")
      .addSelect(["es.id"])
      .leftJoin("e.deskarea", "ed")
      .addSelect(["ed.id"])
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

    // Filter by membership type if provided
    if (filteredRecord?.type) {
      queryBuilder.andWhere("em.type = :membershipType", {
        membershipType: filteredRecord.type,
      });
    }

    if (filteredRecord?.package) {
      switch (filteredRecord.package) {
        case "membership_deskarea": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("em.type = :membershipType AND e.end_date >= :currentDate", {
            membershipType: "deskarea",
            currentDate: today,
          });
          break;
        }
        case "membership_shared": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("em.type = :membershipType AND e.end_date >= :currentDate", {
            membershipType: "shared",
            currentDate: today,
          });
          break;
        }
        case "expired_membership_deskarea": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("em.type = :membershipType AND e.end_date < :currentDate", {
            membershipType: "deskarea",
            currentDate: today,
          });
          break;
        }
        case "expired_membership_shared": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("em.type = :membershipType AND e.end_date < :currentDate", {
            membershipType: "shared",
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
