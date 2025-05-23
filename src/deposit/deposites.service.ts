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
      .leftJoin("e.assignesPackages", "ea_assignespackages")
      .addSelect(["ea_assignespackages.id", "ea_assignespackages.total_price"])
      .leftJoin("ea_assignespackages.individual", "ea_pkg_individual")
      .addSelect(["ea_pkg_individual.id", "ea_pkg_individual.name"])
      .leftJoin("ea_assignespackages.company", "ea_pkg_company")
      .addSelect(["ea_pkg_company.id", "ea_pkg_company.name"])
      .leftJoin("ea_assignespackages.studentActivity", "ea_pkg_student")
      .addSelect(["ea_pkg_student.id", "ea_pkg_student.name"])
      .leftJoin("e.assignessMemebership", "ea_assignessmemebership")
      .leftJoin("ea_assignessmemebership.individual", "ea_mem_individual")
      .addSelect(["ea_mem_individual.id", "ea_mem_individual.name"])
      .leftJoin("ea_assignessmemebership.company", "ea_mem_company")
      .addSelect(["ea_mem_company.id", "ea_mem_company.name"])
      .leftJoin("ea_assignessmemebership.studentActivity", "ea_mem_student")
      .addSelect(["ea_mem_student.id", "ea_mem_student.name"])
      .addSelect(["ea_assignessmemebership.id", "ea_assignessmemebership.total_price"]);

    queryBuilder.addSelect(
      `CASE
        WHEN ea_assignespackages.id IS NOT NULL THEN ea_assignespackages.total_price
        WHEN ea_assignessmemebership.id IS NOT NULL THEN ea_assignessmemebership.total_price
        ELSE 0
      END`,
      "total_price",
    );

    // queryBuilder.addSelect(
    //   `CASE
    //     WHEN ea_pkg_individual.id IS NOT NULL THEN ea_pkg_individual.name
    //     WHEN ea_pkg_company.id IS NOT NULL THEN ea_pkg_company.name
    //     WHEN ea_pkg_student.id IS NOT NULL THEN ea_pkg_student.name
    //     WHEN ea_mem_individual.id IS NOT NULL THEN ea_mem_individual.name
    //     WHEN ea_mem_company.id IS NOT NULL THEN ea_mem_company.name
    //     WHEN ea_mem_student.id IS NOT NULL THEN ea_mem_student.name
    //     ELSE NULL
    //   END`,
    //   "customer",
    // );

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
          qb.where("ea_pkg_individual.name LIKE :search", { search: searchTerm })
            .orWhere("ea_pkg_company.name LIKE :search", { search: searchTerm })
            .orWhere("ea_pkg_student.name LIKE :search", { search: searchTerm })
            .orWhere("ea_mem_individual.name LIKE :search", { search: searchTerm })
            .orWhere("ea_mem_company.name LIKE :search", { search: searchTerm })
            .orWhere("ea_mem_student.name LIKE :search", { search: searchTerm })
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
