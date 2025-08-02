import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
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
            .orWhere("eco.name LIKE :search", { search: searchTerm })
            .orWhere("esa.name LIKE :search", { search: searchTerm })
            .orWhere("CONCAT(ec.firstName, ' ', ec.lastName) LIKE :search", {
              search: searchTerm,
            });
        }),
      );
    }

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

  async findDealsAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      filterField: "all",
    });
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

  protected override response(data: Deals[], totalRecords: number = 0) {
    const getCustomerInfo = (deals: Deals) => {
      if (!deals) return { customer_name: null, customer_id: null };
      const customer = deals.individual || deals.company || deals.studentActivity;
      const phone = deals.individual?.number || deals.company?.phone || null;

      return {
        customer_name: customer?.name || null,
        customer_id: customer?.id || null,
        customer_phone: phone,
      };
    };

    const transformedData = data.map(deals => ({
      ...deals,
      ...getCustomerInfo(deals),
    }));

    return {
      data: transformedData,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }
}
