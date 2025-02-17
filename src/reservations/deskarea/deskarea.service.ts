import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesMembershipService } from "src/assignes-memberships/assignes-membership.service";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { Deskarea } from "./deskarea.entity"; // Changed from Company to Deskarea
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-deskarea.dto";

@Injectable()
export class DeskareaService {
  constructor(
    @InjectRepository(Deskarea)
    private deskareaRepository: Repository<Deskarea>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly membership: AssignesMembershipService,
  ) {}

  async create(
    createDeskareaDto: CreateDeskAreaDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user, offer_id } = createDeskareaDto;

    await this.validateCustomerReservation(customer_id, type_user);

    let assignGeneralOffer = null;

    if (offer_id) {
      const payload = {
        customer_id,
        offer_id,
        type_user,
      } as CreateAssignGeneralOfferDto;

      assignGeneralOffer = await this.assignGlobalOffer.create(payload, reqBody);
    }

    const deskarea = this.deskareaRepository.create({
      ...createDeskareaDto,
      assignGeneralOffer,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.deskareaRepository.save(deskarea);
  }

  // Get all deskareas
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  async findActiveOrInactiveReservationsForCustomer(customer_id: number, customer_type: string) {
    const customerRelationMap = {
      individual: "individual",
      company: "company",
      studentActivity: "studentActivity",
    };

    const customerRelationField = customerRelationMap[customer_type];
    const customerCondition = { [customerRelationField]: { id: customer_id } };

    const existingReservations = await this.deskareaRepository.find({
      relations: [customerRelationField],
      where: [
        {
          status: ReservationStatus.ACTIVE,
          ...customerCondition,
        },
      ],
    });

    return existingReservations;
  }
  // Get deskarea by ID
  async findOne(id: number): Promise<Deskarea> {
    const deskarea = await this.deskareaRepository.findOne({ where: { id } });
    if (!deskarea) {
      throw new NotFoundException(`${deskarea} with id ${id} not found`);
    }
    return deskarea;
  }

  async findDeskareaByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
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
  async findDeskareaByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
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
  async findDeskareaByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
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
  async findDeskareaByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
    queryBuilder
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", {
        user_id: filterData.user_id,
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

  async findReservationsByIndividual(filterData: any) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.assignessMemebership", "em")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .andWhere("em.id = :membership_id", { membership_id: filterData.membership_id })
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
  async findReservationsByCompany(filterData: any) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.assignessMemebership", "em")
      .andWhere("ei.id = :company_id", { company_id: filterData.company_id })
      .andWhere("em.id = :membership_id", { membership_id: filterData.membership_id })

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
  async findReservationsByStudentActivity(filterData: any) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.assignessMemebership", "em")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .andWhere("em.id = :membership_id", { membership_id: filterData.membership_id })

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

  async createReservationByMememberShip(
    createDeskareaDto: CreateDeskAreaDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user, membership_id, selected_day } = createDeskareaDto;

    await this.validateCustomerReservation(customer_id, type_user);

    const memberShip = await this.validateMembership(membership_id);

    this.validateMembershipUsage(memberShip);

    this.validateMembershipDateRange(memberShip, selected_day);

    await this.updateMembershipUsage(memberShip);

    return await this.createAndSaveDeskareaReservation(createDeskareaDto, reqBody, memberShip);
  }

  private async createAndSaveDeskareaReservation(
    createSharedDto: CreateDeskAreaDto,
    reqBody: { customer: Individual | Company | StudentActivity; createdBy: User },
    memberShip: any,
  ) {
    const { type_user } = createSharedDto;
    const shared = this.deskareaRepository.create({
      ...createSharedDto,
      assignessMemebership: memberShip,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    await this.deskareaRepository.save(shared);

    return this.membership.findOne(memberShip.id);
  }

  private async validateCustomerReservation(customerId: number, typeUser: string) {
    const existingReservations = await this.findActiveOrInactiveReservationsForCustomer(
      customerId,
      typeUser,
    );
    if (existingReservations.length) {
      throw new BadRequestException(`You can't create another reservation for this user.`);
    }
  }

  private async validateMembership(membershipId: number) {
    const memberShip = await this.membership.findOne(membershipId);
    if (!memberShip) {
      throw new BadRequestException(`You must have a valid membership.`);
    }
    return memberShip;
  }

  private validateMembershipUsage(memberShip: AssignesMembership) {
    if (memberShip.used == memberShip.total_used) {
      throw new BadRequestException(
        `Your membership quota is exhausted. Please create a new membership.`,
      );
    }
  }

  private validateMembershipDateRange(memberShip: AssignesMembership, selectedDay: string) {
    const selectedDate = moment(selectedDay, "DD/MM/YYYY");
    const startDate = moment(memberShip.start_date);
    const endDate = moment(memberShip.end_date);

    if (!startDate.isSameOrBefore(selectedDate) || !endDate.isSameOrAfter(selectedDate)) {
      throw new BadRequestException(`The memberShip is not active for the selected date.`);
    }
  }
  private async updateMembershipUsage(memberShip: AssignesMembership, operator = "plus") {
    const newUsed = operator === "plus" ? memberShip.used + 1 : memberShip.used - 1;
    const newRemaining =
      operator === "plus" ? memberShip.total_used - newUsed : memberShip.remaining;

    await this.membership.update({
      id: memberShip.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }

  async update(updateDeskareaDto: UpdateDeskAreaDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customer_id, offer_id, type_user, membership_id, ...rest } = updateDeskareaDto;

    if (updateDeskareaDto.status === ReservationStatus.CANCELLED) {
      await this.handleCancelledStatus(updateDeskareaDto, membership_id, rest);
    } else {
      await this.handleCompletedStatus(updateDeskareaDto, rest);
    }

    return this.deskareaRepository.findOne({ where: { id: updateDeskareaDto.id } });
  }

  private async handleCancelledStatus(
    updateDeskareaDto: UpdateDeskAreaDto,
    membershipId: number | undefined,
    rest: Partial<UpdateDeskAreaDto>,
  ) {
    if (membershipId) {
      const memberShip = await this.validateMembership(membershipId);
      await this.updateMembershipUsage(memberShip, "minus");
    }
    await this.deskareaRepository.update(updateDeskareaDto.id, rest);
  }

  private async handleCompletedStatus(
    updateDeskareaDto: UpdateDeskAreaDto,
    rest: Partial<UpdateDeskAreaDto>,
  ) {
    const startDate = this.convertTo24HourDate(rest.start_hour, rest.start_minute, rest.start_time);
    const endDate = this.convertTo24HourDate(rest.end_hour, rest.end_minute, rest.end_time);
    const diffInHours = this.calculateTimeDifferenceInHours(startDate, endDate);
    const totalPrice = diffInHours ? 20 * +diffInHours : 20;
    await this.deskareaRepository.update(updateDeskareaDto.id, {
      ...rest,
      total_time: diffInHours,
      total_price: totalPrice,
      status: ReservationStatus.COMPLETE,
    });
  }

  async remove(deskareaId: number) {
    await this.deskareaRepository.delete(deskareaId);
  }

  private calculateTimeDifferenceInHours(startDate: Date, endDate: Date) {
    const diffInMillis = endDate.getTime() - startDate.getTime();
    return Math.abs(Math.round(diffInMillis / (1000 * 60 * 60)));
  }

  private convertTo24HourDate(hour: number, minute: number, period: string): Date {
    const currentDate = new Date();
    let hour24 = hour;

    if (period === "pm" && hour < 12) hour24 += 12;
    if (period === "am" && hour === 12) hour24 = 0;

    currentDate.setHours(hour24, minute, 0, 0);
    return currentDate;
  }
}
