import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Brackets, Repository, SelectQueryBuilder } from "typeorm";
import { Deposite } from "./deposites.entity";
import { CreateDepositeDto } from "./dto/create-deposites.dto";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@Injectable()
export class DepositeService
  extends BaseService<Deposite, CreateDepositeDto, UpdateDepositeDto>
  implements ICrudService<Deposite, CreateDepositeDto, UpdateDepositeDto>
{
  constructor(
    @InjectRepository(Deposite)
    private depositesRepositry: Repository<Deposite>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(depositesRepositry, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("ea.individual", "ea_individual")
      .leftJoinAndSelect("ea.company", "ea_company")
      .leftJoinAndSelect("ea.studentActivity", "ea_student")
      .leftJoinAndSelect("e.assignessMemebership", "eas")
      .leftJoinAndSelect("eas.individual", "eas_individual")
      .leftJoinAndSelect("eas.company", "eas_company")
      .leftJoinAndSelect("eas.studentActivity", "eas_student")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .leftJoinAndSelect("er.individual", "er_individual")
      .leftJoinAndSelect("er.company", "er_company")
      .leftJoinAndSelect("er.studentActivity", "er_student")
      .leftJoinAndSelect("e.createdBy", "ec");

    queryBuilder.addSelect(
      `CASE
        WHEN ea_individual.id IS NOT NULL THEN ea_individual.name
        WHEN ea_company.id IS NOT NULL THEN ea_company.name
        WHEN ea_student.id IS NOT NULL THEN ea_student.name
        WHEN eas_individual.id IS NOT NULL THEN eas_individual.name
        WHEN eas_company.id IS NOT NULL THEN eas_company.name
        WHEN eas_student.id IS NOT NULL THEN eas_student.name
        WHEN er_individual.id IS NOT NULL THEN er_individual.name
        WHEN er_company.id IS NOT NULL THEN er_company.name
        WHEN er_student.id IS NOT NULL THEN er_student.name
        ELSE CONCAT(ec.firstName, ' ', ec.lastName)
      END`,
      "customer",
    );

    // Date filtering
    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }

    // Search filtering
    if (filteredRecord?.search?.value) {
      const searchTerm = `%${filteredRecord.search?.value}%`;
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("ea_individual.name LIKE :search", { search: searchTerm })
            .orWhere("ea_company.name LIKE :search", { search: searchTerm })
            .orWhere("ea_student.name LIKE :search", { search: searchTerm })
            .orWhere("eas_individual.name LIKE :search", { search: searchTerm })
            .orWhere("eas_company.name LIKE :search", { search: searchTerm })
            .orWhere("eas_student.name LIKE :search", { search: searchTerm })
            .orWhere("er_individual.name LIKE :search", { search: searchTerm })
            .orWhere("er_company.name LIKE :search", { search: searchTerm })
            .orWhere("er_student.name LIKE :search", { search: searchTerm })
            .orWhere("CONCAT(ec.firstName, ' ', ec.lastName) LIKE :search", { search: searchTerm });
        }),
      );
    }
  }
}
