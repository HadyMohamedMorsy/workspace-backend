import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    const filteredRecord = await this.apiFeaturesService
      .setRepository(Company)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
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
