import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { ReservationRoom } from "./reservation-room.entity";

@Injectable()
export class ReservationRoomQueryService {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    private readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async findRelatedEntities(
    filterData: any,
    relationConfig: {
      relationPath: string;
      alias: string;
      selectFields?: string[];
      filterField: string;
    },
  ) {
    const queryBuilder = this.buildBaseQueryBuilder(filterData);
    queryBuilder
      .leftJoin(`e.${relationConfig.relationPath}`, relationConfig.alias)
      .addSelect(relationConfig.selectFields.map(field => `${relationConfig.alias}.${field}`))
      .andWhere(`${relationConfig.alias}.id = :${relationConfig.filterField}`, {
        [relationConfig.filterField]: filterData[relationConfig.filterField],
      })
      .leftJoin("e.deposites", "esdep")
      .addSelect(["esdep.id", "esdep.total_price", "esdep.status"]);

    const [filteredRecord, totalRecords] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  private buildBaseQueryBuilder(filterData: any) {
    return this.apiFeaturesService.setRepository(ReservationRoom).buildQuery(filterData);
  }

  // Specific query methods
  async findRoomsByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
      filterField: "individual_id",
    });
  }

  async findRoomsByCompanyAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name", "phone"],
      filterField: "company_id",
    });
  }

  async findRoomsByStudentActivityAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
    });
  }

  async findRoomsByUserAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }

  async findIndividualPackageRoomAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name", "whatsApp"],
      filterField: "individual_id",
    });
  }

  async findCompanyPackageRoomAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name", "phone"],
      filterField: "company_id",
    });
  }

  async findStudentActivityPackageRoomAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
    });
  }

  async findIndividualDealAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name", "whatsApp"],
      filterField: "individual_id",
    });
  }

  async findCompanyDealAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name", "phone"],
      filterField: "company_id",
    });
  }

  async findStudentActivityDealAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
    });
  }

  async findRoomsByUserType(filterData: any, userType: string) {
    return this.findRelatedEntities(filterData, {
      relationPath: userType,
      alias: "user",
      selectFields: ["id", "name"],
      filterField: `${userType}_id`,
    });
  }
}
