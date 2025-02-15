import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AssignesMembership } from "./assignes-membership.entity";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@Injectable()
export class AssignesMembershipService {
  constructor(
    @InjectRepository(AssignesMembership)
    private assignesMembershipRepository: Repository<AssignesMembership>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService,
  ) {}

  // Create a new record
  async create(
    create: CreateAssignesMembershipDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<AssignesMembership> {
    const memeberShip = await this.offerCoWorkingSpaceService.findOne(create.membership_id);

    if (!memeberShip) {
      throw new NotFoundException(`${memeberShip} with  not found`);
    }

    const assignesMembership = this.assignesMembershipRepository.create({
      ...create,
      createdBy: reqBody.createdBy,
      total_used: +memeberShip.days,
      used: 0,
      remaining: +memeberShip.days,
      [create.type_user.toLowerCase()]: reqBody.customer,
      memeberShip,
    });

    return await this.assignesMembershipRepository.save(assignesMembership);
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignesMembership> {
    const assignesMembership = await this.assignesMembershipRepository.findOne({ where: { id } });
    if (!assignesMembership) {
      throw new NotFoundException(`AssignesMembership with id ${id} not found`);
    }
    return assignesMembership;
  }

  async findAssignesByUser(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
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
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
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
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
      .leftJoin("e.createdBy", "eu")
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"]);

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
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "esh")
      .leftJoinAndSelect("e.deskarea", "ed")
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
  async update(updateAssignesMembershipDto: UpdateAssignesMembershipDto) {
    await this.assignesMembershipRepository.update(
      updateAssignesMembershipDto.id,
      updateAssignesMembershipDto,
    );
    return this.assignesMembershipRepository.findOne({
      where: { id: updateAssignesMembershipDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignesMembershipRepository.delete(id);
  }
}
