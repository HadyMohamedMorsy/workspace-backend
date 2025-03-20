import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesMembershipService } from "src/assignes-memberships/assignes-membership.service";
import { Company } from "src/companies/company.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository, SelectQueryBuilder } from "typeorm";
import { diffrentHour, formatDate } from "../helpers/utitlties";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { Shared } from "./shared.entity";

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Shared)
    private sharedRepository: Repository<Shared>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly offer: GeneralOfferService,
    protected readonly settings: GeneralSettingsService,
    @Inject(forwardRef(() => AssignesMembershipService))
    protected readonly membership: AssignesMembershipService,
  ) {}

  async create(
    createSharedDto: CreateSharedDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user, offer_id } = createSharedDto;
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

    const settings = await this.findSetting(createSharedDto.setting_id);
    const shared = this.sharedRepository.create({
      ...createSharedDto,
      assignGeneralOffer,
      settings,
      createdBy: reqBody.createdBy,
      [type_user]: reqBody.customer,
    });
    return await this.sharedRepository.save(shared);
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
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

    const existingReservations = await this.sharedRepository.find({
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

  async findOne(id: number): Promise<Shared> {
    const shared = await this.sharedRepository.findOne({ where: { id } });
    if (!shared) {
      throw new NotFoundException(`${shared} with id ${id} not found`);
    }
    return shared;
  }

  // Original controller methods (unchanged signatures)
  async findReservationsByIndividual(filterData: any) {
    return this.findReservationsByUserType(filterData, "individual", "individual_id");
  }

  async findReservationsByCompany(filterData: any) {
    return this.findReservationsByUserType(filterData, "company", "company_id");
  }

  async findReservationsByStudentActivity(filterData: any) {
    return this.findReservationsByUserType(filterData, "studentActivity", "studentActivity_id");
  }

  async findSharedByIndividualAll(filterData: any) {
    return this.findSharedByUserTypeAll(filterData, "individual", "individual_id");
  }

  async findSharedByComapnyAll(filterData: any) {
    return this.findSharedByUserTypeAll(filterData, "company", "company_id");
  }

  async findSharedByStudentActivityAll(filterData: any) {
    return this.findSharedByUserTypeAll(filterData, "studentActivity", "studentActivity_id");
  }

  async findSharedByUserAll(filterData: any) {
    const queryBuilder = this.buildBaseQuery(filterData).andWhere("ec.id = :user_id", {
      user_id: filterData.user_id,
    });

    this.addGeneralOfferJoin(queryBuilder);
    return this.getPaginatedResults(queryBuilder);
  }

  async update(updateSharedDto: UpdateSharedDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customer_id, offer_id, membership_id, type_user, ...rest } = updateSharedDto;

    if (updateSharedDto.status === ReservationStatus.CANCELLED) {
      await this.handleCancelledStatus(updateSharedDto, membership_id, rest);
    } else {
      await this.handleCompletedStatus(updateSharedDto, offer_id, rest);
    }

    return this.sharedRepository.findOne({ where: { id: updateSharedDto.id } });
  }

  private async handleCancelledStatus(
    updateSharedDto: UpdateSharedDto,
    membershipId: number | undefined,
    rest: Partial<UpdateSharedDto>,
  ) {
    if (membershipId) {
      const memberShip = await this.validateMembership(membershipId);
      await this.updateMembershipUsage(memberShip, "minus");
    }
    await this.sharedRepository.update(updateSharedDto.id, rest);
  }

  private async handleCompletedStatus(
    updateSharedDto: UpdateSharedDto,
    offerId: number,
    rest: Partial<UpdateSharedDto>,
  ) {
    const { setting_id, ...updateDto } = rest;
    const totalPrice = await this.calculateCoWrokingSpaceTotalPrice(rest, setting_id, offerId);
    const diffInHours = diffrentHour(rest);
    await this.sharedRepository.update(updateSharedDto.id, {
      ...updateDto,
      total_time: updateSharedDto.is_full_day ? 24 : diffInHours,
      total_price: totalPrice,
      status: ReservationStatus.COMPLETE,
    });
  }

  async findSetting(settingId: number) {
    return await this.settings.findOne(settingId);
  }

  async calculateCoWrokingSpaceTotalPrice(
    rest: Partial<UpdateSharedDto>,
    settingId: number,
    offerId: number,
  ) {
    const settings = await this.findSetting(settingId);
    if (rest.is_full_day) return settings.full_day_price_shared;

    const diffInHours = diffrentHour(rest);
    let discount = 0;
    const totalPrice = diffInHours ? settings.price_shared * +diffInHours : settings.price_shared;

    if (offerId) {
      const offer = await this.offer.findOne(offerId);
      const typeDiscount = offer.type_discount;
      const discountAmount = offer.discount;

      discount = typeDiscount === "amount" ? discountAmount : totalPrice * (discountAmount / 100);
    }
    return totalPrice - discount;
  }

  async createReservationByMememberShip(
    createSharedDto: CreateSharedDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user, membership_id, selected_day } = createSharedDto;
    await this.validateCustomerReservation(customer_id, type_user);
    const memberShip = await this.validateMembership(membership_id);
    const selectedDay = formatDate(selected_day);
    this.validateMembershipUsage(memberShip);
    this.validateMembershipDateRange(memberShip, selectedDay);
    await this.updateMembershipUsage(memberShip);
    return await this.createAndSaveSharedReservation(createSharedDto, reqBody, memberShip);
  }

  async validateCustomerReservation(customerId: number, typeUser: string) {
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

  private async createAndSaveSharedReservation(
    createSharedDto: CreateSharedDto,
    reqBody: { customer: Individual | Company | StudentActivity; createdBy: User },
    memberShip: any,
  ) {
    const { type_user } = createSharedDto;
    const shared = this.sharedRepository.create({
      ...createSharedDto,
      assignessMemebership: memberShip,
      createdBy: reqBody.createdBy,
      [type_user]: reqBody.customer,
    });
    await this.sharedRepository.save(shared);
    return this.membership.findOne(memberShip.id);
  }

  async remove(sharedId: number) {
    await this.sharedRepository.delete(sharedId);
  }

  private buildBaseQuery(filterData: any) {
    return this.apiFeaturesService
      .setRepository(Shared)
      .buildQuery(filterData)
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);
  }

  private async getPaginatedResults(queryBuilder: SelectQueryBuilder<Shared>) {
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

  private addMembershipJoin(queryBuilder: SelectQueryBuilder<Shared>, membershipId: number) {
    return queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "em")
      .andWhere("em.id = :membership_id", { membership_id: membershipId });
  }

  private addGeneralOfferJoin(queryBuilder: SelectQueryBuilder<Shared>) {
    return queryBuilder
      .leftJoinAndSelect("e.assignGeneralOffer", "es")
      .leftJoinAndSelect("es.generalOffer", "eg");
  }

  async findReservationsByUserType(
    filterData: any,
    userType: "individual" | "company" | "studentActivity",
    idKey: string,
  ) {
    const queryBuilder = this.buildBaseQuery(filterData)
      .leftJoinAndSelect(`e.${userType}`, "user")
      .andWhere(`user.id = :${idKey}`, { [idKey]: filterData[idKey] });

    this.addMembershipJoin(queryBuilder, filterData.membership_id);
    return this.getPaginatedResults(queryBuilder);
  }

  async findSharedByUserTypeAll(
    filterData: any,
    userType: "individual" | "company" | "studentActivity",
    idKey: string,
  ) {
    const queryBuilder = this.buildBaseQuery(filterData)
      .leftJoinAndSelect(`e.${userType}`, "user")
      .leftJoinAndSelect("e.settings", "settings")
      .andWhere(`user.id = :${idKey}`, { [idKey]: filterData[idKey] })
      .andWhere("e.assignessMemebership IS NULL");

    this.addGeneralOfferJoin(queryBuilder);
    return this.getPaginatedResults(queryBuilder);
  }
}
