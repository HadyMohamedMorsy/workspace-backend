import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
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
    protected readonly offerPackagesService: OfferPackagesService,
  ) {}

  // Create a new record
  async create(
    create: CreateAssignesPackageDto,
    customer: Individual | Company | StudentActivity,
  ): Promise<AssignesPackages> {
    const packages = await this.offerPackagesService.findOne(create.package_id);
    if (!packages) {
      throw new NotFoundException(`packages with  not found`);
    }

    const assignes_packages = this.assignesPackagesRepository.create({
      ...create,
      [create.type_user.toLowerCase()]: customer,
      packages,
    });
    return await this.assignesPackagesRepository.save(assignes_packages);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesPackages)
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
  async findOne(id: number): Promise<AssignesPackages> {
    const assignes_packages = await this.assignesPackagesRepository.findOne({ where: { id } });
    if (!assignes_packages) {
      throw new NotFoundException(`assignes_packages with id ${id} not found`);
    }
    return assignes_packages;
  }

  async findAssignesByIndividual(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }
  async findAssignesByCompany(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }
  async findAssignesByStudentActivity(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Update a record
  async update(updateassignes_packagesDto: UpdateAssignesPackageDto) {
    await this.assignesPackagesRepository.update(
      updateassignes_packagesDto.id,
      updateassignes_packagesDto,
    );
    return this.assignesPackagesRepository.findOne({
      where: { id: updateassignes_packagesDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignesPackagesRepository.delete(id);
  }
}
