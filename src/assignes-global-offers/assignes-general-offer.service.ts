import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { Individual } from "src/individual/individual.entity";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
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
  async create(
    create: CreateAssignGeneralOfferDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<AssignGeneralOffer> {
    const generalOffer = await this.generalOfferService.findOne(create.offer_id);

    if (!generalOffer) {
      throw new NotFoundException(`${generalOffer} with  not found`);
    }

    const assignGeneralOffer = this.assignGeneralOfferRepository.create({
      ...create,
      createdBy: reqBody.createdBy,
      [create.type_user.toLowerCase()]: reqBody.customer,
      generalOffer,
    });
    return await this.assignGeneralOfferRepository.save(assignGeneralOffer);
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignGeneralOffer> {
    const assignGeneralOffer = await this.assignGeneralOfferRepository.findOne({ where: { id } });
    if (!assignGeneralOffer) {
      throw new NotFoundException(`AssignGeneralOffer with id ${id} not found`);
    }
    return assignGeneralOffer;
  }

  async findAssignesByUser(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.generalOffer", "eg")
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
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
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
  async findAssignesByStudentActivity(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.generalOffer", "eg")
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
