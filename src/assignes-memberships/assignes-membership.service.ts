import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
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
      .leftJoin("e.individual", "ei")
      .addSelect(["ei.id", "ei.name", "ei.whatsApp", "ei.number"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.phone", "eco.name"])
      .leftJoin("e.studentActivity", "esa")
      .addSelect(["esa.id", "esa.name", "esa.unviresty"])
      // Left join to check if individual has active membership
      .leftJoin("ei.assign_memberships", "ei_am", "ei_am.status = :activeStatus", {
        activeStatus: ReservationStatus.ACTIVE,
      })
      .addSelect(["ei_am.id"])
      // Left join to check if company has active membership
      .leftJoin("eco.assign_memberships", "eco_am", "eco_am.status = :activeStatus", {
        activeStatus: ReservationStatus.ACTIVE,
      })
      .addSelect(["eco_am.id"])
      // Left join to check if studentActivity has active membership
      .leftJoin("esa.assign_memberships", "esa_am", "esa_am.status = :activeStatus", {
        activeStatus: ReservationStatus.ACTIVE,
      })
      .addSelect(["esa_am.id"]);

    // Filter by membership type if provided
    if (filteredRecord?.type) {
      queryBuilder.andWhere("em.type = :membershipType", {
        membershipType: filteredRecord.type,
      });
    }

    if (filteredRecord?.search?.value) {
      const searchTerm = `%${filteredRecord.search?.value}%`;
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("ei.name LIKE :search", { search: searchTerm })
            .orWhere("ei.number LIKE :search", { search: searchTerm })
            .orWhere("ei.whatsApp LIKE :search", { search: searchTerm })
            .orWhere("eco.name LIKE :search", { search: searchTerm })
            .orWhere("eco.phone LIKE :search", { search: searchTerm })
            .orWhere("eco.whatsApp LIKE :search", { search: searchTerm })
            .orWhere("esa.name LIKE :search", { search: searchTerm })
            .orWhere("CONCAT(ec.firstName, ' ', ec.lastName) LIKE :search", {
              search: searchTerm,
            });
        }),
      );
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
          queryBuilder.andWhere(
            "em.type = :membershipType AND e.end_date < :currentDate AND (e.status = :status_active OR e.status = :status_complete)",
            {
              membershipType: "deskarea",
              currentDate: today,
              status_active: ReservationStatus.ACTIVE,
              status_complete: ReservationStatus.COMPLETE,
            },
          );
          break;
        }
        case "expired_membership_shared": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "em.type = :membershipType AND e.end_date < :currentDate AND (e.status = :status_active OR e.status = :status_complete)",
            {
              membershipType: "shared",
              currentDate: today,
              status_active: ReservationStatus.ACTIVE,
              status_complete: ReservationStatus.COMPLETE,
            },
          );
          break;
        }
      }
    }
  }

  async findAssignesAll(filterData: any) {
    return await this.findRelatedEntities(filterData, {
      filterField: "all",
    });
  }

  async findAssignesByUser(filterData: any) {
    return await this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }

  async findAssignesByIndividual(filterData: any) {
    return await this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
      filterField: "individual_id",
    });
  }

  async findAssignesByCompany(filterData: any) {
    return await this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name"],
      filterField: "company_id",
    });
  }

  async findAssignesByStudentActivity(filterData: any) {
    return await this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name"],
      filterField: "studentActivity_id",
    });
  }

  protected override response(data: AssignesMembership[], totalRecords: number = 0) {
    const getCustomerInfo = (shared: AssignesMembership) => {
      if (!shared) return { customer_name: null, customer_id: null };
      const customer = shared.individual || shared.company || shared.studentActivity;
      const phone = shared.individual?.number || shared.company?.phone || null;

      // Check if the client has any active membership
      const hasActiveMembership = !!(
        shared.individual?.assign_memberships?.length ||
        shared.company?.assign_memberships?.length ||
        shared.studentActivity?.assign_memberships?.length
      );

      return {
        customer_name: customer?.name || null,
        customer_id: customer?.id || null,
        customer_phone: phone,
        has_active_membership: hasActiveMembership,
      };
    };

    const transformedData = data.map(assignesMembership => ({
      ...assignesMembership,
      ...getCustomerInfo(assignesMembership),
    }));

    return {
      data: transformedData,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }
}
