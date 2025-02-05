import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { Repository } from "typeorm";
import { assignes_packages } from "./assignes-packages.entity";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@Injectable()
export class assignes_packagesService {
  constructor(
    @InjectRepository(assignes_packages)
    private assignes_packagesRepository: Repository<assignes_packages>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly offerPackagesService: OfferPackagesService,
  ) {}

  // Create a new record
  async create(
    create: CreateAssignesPackageDto,
    customer: Individual | Company | StudentActivity,
  ): Promise<assignes_packages> {
    const packages = await this.offerPackagesService.findOne(create.package_id);

    if (!packages) {
      throw new NotFoundException(`${packages} with  not found`);
    }

    const assignes_packages = this.assignes_packagesRepository.create({
      ...create,
      [create.type_user.toLowerCase()]: customer,
      packages,
    });
    return await this.assignes_packagesRepository.save(assignes_packages);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(assignes_packages)
      .buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Get a single record by ID
  async findOne(id: number): Promise<assignes_packages> {
    const assignes_packages = await this.assignes_packagesRepository.findOne({ where: { id } });
    if (!assignes_packages) {
      throw new NotFoundException(`assignes_packages with id ${id} not found`);
    }
    return assignes_packages;
  }

  // Update a record
  async update(updateassignes_packagesDto: UpdateAssignesPackageDto) {
    await this.assignes_packagesRepository.update(
      updateassignes_packagesDto.id,
      updateassignes_packagesDto,
    );
    return this.assignes_packagesRepository.findOne({
      where: { id: updateassignes_packagesDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignes_packagesRepository.delete(id);
  }
}
