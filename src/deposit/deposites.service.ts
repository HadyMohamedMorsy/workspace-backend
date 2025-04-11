import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Brackets, Repository } from "typeorm";
import { Deposite } from "./deposites.entity";
import { CreateDepositeDto } from "./dto/create-deposites.dto";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@Injectable()
export class DepositeService {
  constructor(
    @InjectRepository(Deposite)
    private depositesRepositry: Repository<Deposite>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(createDepositeDto: CreateDepositeDto) {
    const deposite = this.depositesRepositry.create(createDepositeDto);
    const newDeposite = await this.depositesRepositry.save(deposite);
    return this.findOne(newDeposite.id);
  }

  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Deposite);
    const queryBuilder = this.apiFeaturesService.setRepository(Deposite).buildQuery(filterData);

    // Join all necessary relations with unique aliases
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

    // Add calculated customer field
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
    if (filterData?.customFilters?.start_date && filterData?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filterData.customFilters.start_date,
        end_date: filterData.customFilters.end_date,
      });
    }

    // Search filtering
    if (filterData?.search?.value) {
      const searchTerm = `%${filterData.search?.value}%`;
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

    const results = await queryBuilder.getRawMany();

    // Map to expected format
    const data = results.map(row => ({
      id: row.e_id,
      total_price: row.e_total_price,
      payment_method: row.e_payment_method,
      status: row.e_status,
      assignesPackages: {
        total_price: row.ea_total_price,
      },
      assignessMemebership: {
        total_price: row.eas_total_price,
      },
      reservationRooms: {
        total_price: row.er_total_price,
      },
      customer: row.customer,
      createdBy: {
        firstName: row.ec_firstName,
        lastName: row.ec_lastname,
      },
      created_at: row.e_created_at,
    }));

    const totalRecords = await queryBuilder.getCount();

    return {
      data,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number) {
    const deposite = this.depositesRepositry.findOne({ where: { id } });
    if (!deposite) {
      throw new NotFoundException(`deal with id not found`);
    }
    return deposite;
  }

  async update(updateDepositeDto: UpdateDepositeDto) {
    await this.depositesRepositry.update(updateDepositeDto.id, updateDepositeDto);
    return this.depositesRepositry.findOne({ where: { id: updateDepositeDto.id } });
  }

  async remove(id: number) {
    await this.depositesRepositry.delete(id);
  }
}
