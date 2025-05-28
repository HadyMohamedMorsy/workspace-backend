import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository, SelectQueryBuilder } from "typeorm";
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
      additionalRelations?: Array<{
        relationPath: string;
        alias: string;
        selectFields?: string[];
        filterField?: string;
      }>;
      additionalConditions?: Array<{
        field: string;
        value: any;
      }>;
    },
  ) {
    const queryBuilder = this.buildBaseQueryBuilder(filterData);

    this.applyMainRelation(queryBuilder, relationConfig, filterData);
    this.applyAdditionalRelations(queryBuilder, relationConfig, filterData);
    this.applyAdditionalConditions(queryBuilder, relationConfig);
    this.applySelectFields(queryBuilder, relationConfig);

    return this.executeQuery(queryBuilder);
  }

  private buildBaseQueryBuilder(filterData: any) {
    return this.apiFeaturesService.setRepository(ReservationRoom).buildQuery(filterData);
  }

  private applyMainRelation(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relationConfig: {
      relationPath: string;
      selectFields?: string[];
      alias: string;
      filterField: string;
    },
    filterData: any,
  ) {
    queryBuilder
      .leftJoin(`e.${relationConfig.relationPath}`, relationConfig.alias)
      .addSelect(relationConfig.selectFields.map(field => `${relationConfig.alias}.${field}`))
      .andWhere(`${relationConfig.alias}.id = :${relationConfig.filterField}`, {
        [relationConfig.filterField]: filterData[relationConfig.filterField],
      });
  }

  private applyAdditionalRelations(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relationConfig: {
      additionalRelations?: Array<{
        relationPath: string;
        alias: string;
        selectFields?: string[];
        filterField?: string;
      }>;
    },
    filterData: any,
  ) {
    if (!relationConfig.additionalRelations) return;

    relationConfig.additionalRelations.forEach(relation => {
      queryBuilder.leftJoinAndSelect(`e.${relation.relationPath}`, relation.alias);

      if (relation.filterField) {
        this.applyRelationFilter(
          queryBuilder,
          {
            alias: relation.alias,
            filterField: relation.filterField,
          },
          filterData,
        );
      }

      if (relation.selectFields) {
        this.applyRelationSelectFields(queryBuilder, {
          alias: relation.alias,
          selectFields: relation.selectFields,
        });
      }
    });
  }

  private applyRelationFilter(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relation: {
      alias: string;
      filterField: string;
    },
    filterData: any,
  ) {
    queryBuilder.andWhere(`${relation.alias}.id = :${relation.filterField}`, {
      [relation.filterField]: filterData[relation.filterField],
    });
  }

  private applyRelationSelectFields(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relation: {
      alias: string;
      selectFields: string[];
    },
  ) {
    queryBuilder.addSelect(relation.selectFields.map(field => `${relation.alias}.${field}`));
  }

  private applyAdditionalConditions(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relationConfig: {
      additionalConditions?: Array<{
        field: string;
        value: any;
      }>;
    },
  ) {
    if (!relationConfig.additionalConditions) return;

    relationConfig.additionalConditions.forEach(condition => {
      queryBuilder.andWhere(`e.${condition.field} = :${condition.field}`, {
        [condition.field]: condition.value,
      });
    });
  }

  private applySelectFields(
    queryBuilder: SelectQueryBuilder<ReservationRoom>,
    relationConfig: {
      alias: string;
      selectFields?: string[];
    },
  ) {
    if (!relationConfig.selectFields) return;

    queryBuilder.addSelect(
      relationConfig.selectFields.map(field => `${relationConfig.alias}.${field}`),
    );
  }

  private async executeQuery(queryBuilder: SelectQueryBuilder<ReservationRoom>) {
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

  // Specific query methods
  async findRoomsByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name", "whatsApp"],
      filterField: "individual_id",
      additionalConditions: [
        { field: "assignesPackages", value: null },
        { field: "deals", value: null },
      ],
    });
  }

  async findRoomsByCompanyAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name", "phone"],
      filterField: "company_id",
      additionalConditions: [
        { field: "assignesPackages", value: null },
        { field: "deals", value: null },
      ],
    });
  }

  async findRoomsByStudentActivityAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
      additionalConditions: [
        { field: "assignesPackages", value: null },
        { field: "deals", value: null },
      ],
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
      additionalRelations: [
        {
          relationPath: "deals",
          alias: "deals",
          filterField: "deal_id",
        },
      ],
    });
  }

  async findStudentActivityDealAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
      additionalRelations: [
        {
          relationPath: "deals",
          alias: "deals",
          filterField: "deal_id",
        },
      ],
    });
  }

  async findRoomsByUserType(filterData: any, userType: string) {
    return this.findRelatedEntities(filterData, {
      relationPath: userType,
      alias: "user",
      selectFields: ["id", "name"],
      filterField: `${userType}_id`,
      additionalRelations: [
        {
          relationPath: "room",
          alias: "room",
        },
        {
          relationPath: "createdBy",
          alias: "creator",
          selectFields: ["id", "firstName", "lastName"],
        },
      ],
    });
  }
}
