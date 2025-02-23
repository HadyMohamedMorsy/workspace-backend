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
import { calculateTimeDifferenceInHours, convertTo24HourDate } from "src/shared/helpers/utilities";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
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

  async findDeskareaByIndividualAll(filterData: any) {
    return this.findByUserType(filterData, Deskarea, "individual", "individual_id");
  }

  async findDeskareaByComapnyAll(filterData: any) {
    return this.findByUserType(filterData, Deskarea, "company", "company_id");
  }

  async findDeskareaByStudentActivityAll(filterData: any) {
    return this.findByUserType(filterData, Deskarea, "studentActivity", "studentActivity_id");
  }

  async findDeskareaByUserAll(filterData: any) {
    const queryBuilder = this.buildBaseQuery(filterData, Deskarea).andWhere("ec.id = :user_id", {
      user_id: filterData.user_id,
    });

    return this.getPaginatedResults(queryBuilder);
  }

  async findReservationsByIndividual(filterData: any) {
    return this.findReservationsByUserType(filterData, Deskarea, "individual", "individual_id");
  }

  async findReservationsByCompany(filterData: any) {
    return this.findReservationsByUserType(filterData, Deskarea, "company", "company_id");
  }

  async findReservationsByStudentActivity(filterData: any) {
    return this.findReservationsByUserType(
      filterData,
      Deskarea,
      "studentActivity",
      "studentActivity_id",
    );
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
    const selectedDay = this.formatDate(selected_day);

    this.validateMembershipUsage(memberShip);
    this.validateMembershipDateRange(memberShip, selectedDay);
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
    const startDate = convertTo24HourDate(rest.start_hour, rest.start_minute, rest.start_time);
    const endDate = convertTo24HourDate(rest.end_hour, rest.end_minute, rest.end_time);
    const diffInHours = calculateTimeDifferenceInHours(startDate, endDate);
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

  private buildBaseQuery(filterData: any, repository: any) {
    return this.apiFeaturesService
      .setRepository(repository)
      .buildQuery(filterData)
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);
  }

  private async getPaginatedResults(queryBuilder: SelectQueryBuilder<any>) {
    const [data, totalRecords] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }

  private addMembershipJoin(queryBuilder: SelectQueryBuilder<any>, membershipId: number) {
    return queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "em")
      .andWhere("em.id = :membership_id", { membership_id: membershipId });
  }

  // Generic query methods
  private async findByUserType(
    filterData: any,
    repository: any,
    userType: "individual" | "company" | "studentActivity",
    idKey: string,
  ) {
    const queryBuilder = this.buildBaseQuery(filterData, repository)
      .leftJoinAndSelect(`e.${userType}`, "user")
      .andWhere(`user.id = :${idKey}`, { [idKey]: filterData[idKey] })
      .andWhere("e.assignessMemebership IS NULL");

    return this.getPaginatedResults(queryBuilder);
  }

  private async findReservationsByUserType(
    filterData: any,
    repository: any,
    userType: "individual" | "company" | "studentActivity",
    idKey: string,
  ) {
    const queryBuilder = this.buildBaseQuery(filterData, repository)
      .leftJoinAndSelect(`e.${userType}`, "user")
      .andWhere(`user.id = :${idKey}`, { [idKey]: filterData[idKey] });

    this.addMembershipJoin(queryBuilder, filterData.membership_id);
    return this.getPaginatedResults(queryBuilder);
  }

  formatDate(date: string): string {
    return moment(date).format("DD/MM/YYYY");
  }
}
