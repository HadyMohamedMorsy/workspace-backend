import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { Deskarea } from "./deskarea.entity";
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-deskarea.dto";

@Injectable()
export class DeskareaService
  extends BaseService<Deskarea, CreateDeskAreaDto, UpdateDeskAreaDto>
  implements ICrudService<Deskarea, CreateDeskAreaDto, UpdateDeskAreaDto>
{
  constructor(
    @InjectRepository(Deskarea)
    repository: Repository<Deskarea>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);

    queryBuilder
      .leftJoin("e.individual", "ei")
      .addSelect(["ei.id", "ei.name", "ei.whatsApp"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.phone", "eco.name"])
      .leftJoin("e.studentActivity", "esa")
      .addSelect(["esa.id", "esa.name", "esa.unviresty"])
      .leftJoin("e.assignGeneralOffer", "ego")
      .addSelect(["ego.id"])
      .leftJoin("ego.generalOffer", "egog")
      .addSelect(["egog.id", "egog.type_discount", "egog.discount"]);

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

    if (filteredRecord?.start_date && filteredRecord?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.start_date,
        end_date: filteredRecord.end_date,
      });
    }
  }

  async findDeskareaByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
      filterField: "individual_id",
    });
  }

  async findDeskareaByCompanyAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name"],
      filterField: "company_id",
    });
  }

  async findDeskareaByStudentActivityAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name"],
      filterField: "studentActivity_id",
    });
  }

  async findDeskareaByUserAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }

  async findDeskareaByMembershipAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "assignessMemebership",
      alias: "assignessMemebership",
      selectFields: ["id", "status"],
      filterField: "membership_id",
    });
  }

  protected override response(data: Deskarea[], totalRecords: number = 0) {
    const getCustomerInfo = (deskarea: Deskarea) => {
      if (!deskarea) return { customer_name: null, customer_id: null };

      const customer = deskarea.individual || deskarea.company || deskarea.studentActivity;
      return {
        customer_name: customer?.name || null,
        customer_id: customer?.id || null,
      };
    };

    const transformedData = data.map(shared => ({
      ...shared,
      ...getCustomerInfo(shared),
    }));

    return {
      data: transformedData,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }
}
