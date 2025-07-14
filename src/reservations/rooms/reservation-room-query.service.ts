import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { ReservationStatus } from "src/shared/enum/global-enum";
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
      .addSelect(["esdep.id", "esdep.total_price", "esdep.status"])
      .leftJoin("e.room", "esroom")
      .addSelect(["esroom.id", "esroom.name", "esroom.price"]);

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

  async findByPackageRoomAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "assignesPackages",
      alias: "assignesPackages",
      selectFields: ["id", "status"],
      filterField: "package_id",
    });
  }

  async findByDealRoomAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "deals",
      alias: "deals",
      selectFields: ["id", "status"],
      filterField: "deal_id",
    });
  }

  async findPendingReservationsByCustomer(customerType: string, customerId: number) {
    const queryBuilder = this.reservationRoomRepository.createQueryBuilder("reservation");

    const today = moment().format("DD/MM/YYYY");

    queryBuilder
      .andWhere("reservation.status = :status", { status: ReservationStatus.PENDING })
      .andWhere("reservation.selected_day = :today", { today });

    switch (customerType) {
      case "individual":
        queryBuilder
          .leftJoin("reservation.individual", "individual")
          .addSelect(["individual.id", "individual.name"])
          .andWhere("individual.id = :customerId", { customerId });
        break;

      case "company":
        queryBuilder
          .leftJoin("reservation.company", "company")
          .addSelect(["company.id", "company.name", "company.phone"])
          .andWhere("company.id = :customerId", { customerId });
        break;

      case "studentActivity":
        queryBuilder
          .leftJoin("reservation.studentActivity", "studentActivity")
          .addSelect(["studentActivity.id", "studentActivity.name", "studentActivity.unviresty"])
          .andWhere("studentActivity.id = :customerId", { customerId });
        break;

      default:
        throw new Error(
          `Invalid customer_type: ${customerType}. Supported types: individual, company, studentActivity`,
        );
    }

    // Add room and deposit information
    queryBuilder
      .leftJoin("reservation.room", "room")
      .addSelect(["room.id", "room.name", "room.price"])
      .leftJoin("reservation.deposites", "deposites")
      .addSelect(["deposites.id", "deposites.total_price", "deposites.status"])
      .leftJoin("reservation.createdBy", "createdBy")
      .addSelect(["createdBy.id", "createdBy.firstName", "createdBy.lastName"]);

    const [data, totalRecords] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }
}
