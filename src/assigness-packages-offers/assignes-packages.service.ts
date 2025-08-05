import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
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
      .leftJoin("e.individual", "ei")
      .addSelect(["ei.id", "ei.name", "ei.whatsApp", "ei.number"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.phone", "eco.name"])
      .leftJoin("e.studentActivity", "esa")
      .addSelect(["esa.id", "esa.name", "esa.unviresty"]);

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

    if (filteredRecord?.room_id) {
      queryBuilder.andWhere("ep.id = :roomId", {
        roomId: filteredRecord.room_id,
      });
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

  protected override response(data: AssignesPackages[], totalRecords: number = 0) {
    const getCustomerInfo = (shared: AssignesPackages) => {
      if (!shared) return { customer_name: null, customer_id: null };
      const customer = shared.individual || shared.company || shared.studentActivity;
      const phone = shared.individual?.number || shared.company?.phone || null;

      return {
        customer_name: customer?.name || null,
        customer_id: customer?.id || null,
        customer_phone: phone,
      };
    };

    const transformedData = data.map(assignesPackages => ({
      ...assignesPackages,
      ...getCustomerInfo(assignesPackages),
    }));

    return {
      data: transformedData,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }
}
