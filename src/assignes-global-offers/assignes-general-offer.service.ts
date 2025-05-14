import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { AssignGeneralOffer } from "./assignes-general-offer.entity";
import { CreateAssignGeneralOfferDto } from "./dto/create-assign-general-offer.dto";
import { UpdateAssignGeneralOfferDto } from "./dto/update-assign-general-offer.dto";

@Injectable()
export class AssignGeneralOfferservice {
  constructor(
    @InjectRepository(AssignGeneralOffer)
    private assignGeneralOfferRepository: Repository<AssignGeneralOffer>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly generalOfferService: GeneralOfferService,
  ) {}

  // Create a new record
  async create(create: CreateAssignGeneralOfferDto): Promise<AssignGeneralOffer> {
    const assignGeneralOffer = this.assignGeneralOfferRepository.create(create);
    return await this.assignGeneralOfferRepository.save(assignGeneralOffer);
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignGeneralOffer> {
    const assignGeneralOffer = await this.assignGeneralOfferRepository.findOne({
      where: { id },
      relations: ["generalOffer"],
    });
    if (!assignGeneralOffer) {
      throw new NotFoundException(`AssignGeneralOffer  not found`);
    }
    return assignGeneralOffer;
  }

  async findAssignesByUser(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.generalOffer", "eg")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.reservationRooms", "er")
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
  async findAssignesByIndividual(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.generalOffer", "eg")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

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
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.generalOffer", "eg")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
      .leftJoin("e.createdBy", "ecr")
      .addSelect(["ecr.id", "ecr.firstName", "ecr.lastName"]);

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
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.generalOffer", "eg")
      .leftJoinAndSelect("e.shared", "ess")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.reservationRooms", "er")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

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
  async update(updateAssignGeneralOfferDto: UpdateAssignGeneralOfferDto) {
    await this.assignGeneralOfferRepository.update(
      updateAssignGeneralOfferDto.id,
      updateAssignGeneralOfferDto,
    );
    return this.assignGeneralOfferRepository.findOne({
      where: { id: updateAssignGeneralOfferDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignGeneralOfferRepository.delete(id);
  }
}
