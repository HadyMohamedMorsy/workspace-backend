import { ConflictException, Injectable } from "@nestjs/common";
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
    try {
      const company = this.companyRepository.create(createCompanyDto);
      return await this.companyRepository.save(company);
    } catch (error) {
      if (error.code === "23505") {
        if (error.constraint === "UQ_e53ef0697f9d5d933fa075be1c3") {
          throw new ConflictException("The phone number is already taken.");
        } else if (error.constraint === "UQ_dbb467625f453730336a9136d6c") {
          throw new ConflictException("The WhatsApp number is already registered.");
        } else if (error.constraint === "UQ_6d09f7c3e4ddf573f842bfa51c7") {
          throw new ConflictException("The Facebook is already registered.");
        } else if (error.constraint === "UQ_96c8a2ca6771f4e66d01e5270eb") {
          throw new ConflictException("The Website is already registered.");
        } else if (error.constraint === "UQ_7dc7f95dd5c92a645c93a9417ba") {
          throw new ConflictException("instagram is already registered.");
        } else if (error.constraint === "UQ_5b43f77b200fd08d92dbf00c5f3") {
          throw new ConflictException("Linkedin is already registered.");
        }
      }
      throw error;
    }
  }

  // Get all products
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Company);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get product by ID
  async findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne({ where: { id } });
  }

  // Update a product
  async update(updateCompanyDto: UpdateCompanyDto) {
    await this.companyRepository.update(updateCompanyDto.id, updateCompanyDto);
    return this.companyRepository.findOne({ where: { id: updateCompanyDto.id } });
  }

  // Delete a product
  async remove(id: number) {
    await this.companyRepository.delete(id);
  }
}
