import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { DeskareaService } from "src/reservations/deskarea/deskarea.service";
import { SharedService } from "src/reservations/shared/shared.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
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
    @Inject(forwardRef(() => SharedService))
    private readonly shared: SharedService,

    @Inject(forwardRef(() => DeskareaService))
    private readonly deskarea: DeskareaService,
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

    const newMember = await this.assignesMembershipRepository.save(assignesMembership);
    return await this.findOne(newMember.id);
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignesMembership> {
    const assignesMembership = await this.assignesMembershipRepository.findOne({
      where: { id },
      relations: ["memeberShip"],
    });
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
    const { type, type_user, user_id, status, id } = updateAssignesMembershipDto;
    if (status === ReservationStatus.COMPLETE) {
      await this.handleValidationIfNeeded(user_id, type, type_user);
    }
    await this.assignesMembershipRepository.update(id, { status });
    return this.getUpdatedEntity(id);
  }

  private async handleValidationIfNeeded(user_id: number, type?: string, type_user?: string) {
    if (!type && !type_user) return;

    const validationService = this.getValidationService(type);
    await validationService?.validateCustomerReservation(user_id, type_user);
  }

  private getValidationService(type?: string) {
    return type === "shared" ? this.shared : this.deskarea;
  }

  private async getUpdatedEntity(id: number) {
    return this.assignesMembershipRepository.findOne({
      where: { id },
    });
  }
  async remove(id: number) {
    await this.assignesMembershipRepository.delete(id);
  }
}
