import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Deskarea } from "./deskarea.entity";
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-deskarea.dto";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
  filterField: string;
};

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

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);

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

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);

    queryBuilder
      .leftJoin("e.individual", "ep")
      .addSelect(["ep.id", "ep.name", "ep.whatsApp"])
      .leftJoin("e.company", "ec")
      .addSelect(["ec.id", "ec.phone", "ec.name"])
      .leftJoin("e.studentActivity", "es")
      .addSelect(["es.id", "es.name", "es.unviresty"]);

    if (filteredRecord.search.value) {
      queryBuilder.andWhere(
        `ep.name LIKE :name OR ec.name LIKE :name OR es.name LIKE :name OR ecr.firstName LIKE :name`,
        {
          name: `%${filteredRecord.search.value}%`,
        },
      );
      queryBuilder.andWhere(`ec.whatsApp LIKE :number OR ep.whatsApp LIKE :number`, {
        number: `%${filteredRecord.search.value}%`,
      });
    }

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }

  async findDeskareaByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "firstName", "lastName"],
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
}
