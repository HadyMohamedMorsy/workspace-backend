import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { Company } from "./company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new product
  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    return await this.companyRepository.save(company);
  }

  // Get all products
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Company).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("ep.memeberShip", "ms")
      .leftJoinAndSelect("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("es.packages", "pa")
      .leftJoinAndSelect("pa.room", "pr")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();
    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Company).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Get product by ID
  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`${company} with id ${id} not found`);
    }
    return company;
  }

  // Update a product
  async update(updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(updateCompanyDto.id, updateCompanyDto);
    return this.companyRepository.findOne({ where: { id: updateCompanyDto.id } });
  }

  // Delete a product
  async remove(companyId: number) {
    await this.companyRepository.delete(companyId);
  }
}
