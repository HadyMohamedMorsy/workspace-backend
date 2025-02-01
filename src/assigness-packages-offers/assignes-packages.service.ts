import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { TypeUser } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { Repository } from "typeorm";
import { AssignesPackages } from "./assignes-packages.entity";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@Injectable()
export class AssignesPackagesService {
  constructor(
    @InjectRepository(AssignesPackages)
    private assignesPackagesRepository: Repository<AssignesPackages>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly individualService: IndividualService,
    protected readonly companyService: CompanyService,
    protected readonly studentActivityService: StudentActivityService,
    protected readonly offerPackagesService: OfferPackagesService,
  ) {}

  // Create a new record
  async create(create: CreateAssignesPackageDto): Promise<AssignesPackages> {
    const packages = await this.offerPackagesService.findOne(create.package_id);

    if (!packages) {
      throw new NotFoundException(`${packages} with  not found`);
    }

    let customer;

    switch (create.type_user) {
      case TypeUser.Individual:
        customer = await this.individualService.findOne(create.customer_id);
        break;
      case TypeUser.Company:
        customer = await this.companyService.findOne(create.customer_id);
        break;
      case TypeUser.StudentActivity:
        customer = await this.studentActivityService.findOne(create.customer_id);
        break;
      default:
        throw new Error("Invalid user type");
    }

    const assignesPackages = this.assignesPackagesRepository.create({
      ...create,
      [create.type_user.toLowerCase()]: customer,
      packages,
    });
    return await this.assignesPackagesRepository.save(assignesPackages);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(AssignesPackages)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignesPackages> {
    const assignesPackages = await this.assignesPackagesRepository.findOne({ where: { id } });
    if (!assignesPackages) {
      throw new NotFoundException(`AssignesPackages with id ${id} not found`);
    }
    return assignesPackages;
  }

  // Update a record
  async update(updateAssignesPackagesDto: UpdateAssignesPackageDto) {
    await this.assignesPackagesRepository.update(
      updateAssignesPackagesDto.id,
      updateAssignesPackagesDto,
    );
    return this.assignesPackagesRepository.findOne({ where: { id: updateAssignesPackagesDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignesPackagesRepository.delete(id);
  }
}
