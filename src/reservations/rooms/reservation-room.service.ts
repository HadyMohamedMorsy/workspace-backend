import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { Room } from "src/rooms/room.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { ReservationStatus, TimeOfDay, TypeUser } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { convertTo24HourDate } from "src/shared/helpers/utilities";
import { Repository } from "typeorm";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoom } from "./reservation-room.entity";

type ReservationType = "offer" | "package" | "deal";

@Injectable()
export class ReservationRoomService {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    private readonly apiFeaturesService: APIFeaturesService,
    private readonly assignGlobalOffer: AssignGeneralOfferservice,
    private readonly globalOffer: GeneralOfferService,
    private readonly room: RoomsService,
    private readonly packageRooms: AssignesPackagesService,
    private readonly deal: DealsService,
  ) {}

  // ==================== PUBLIC METHODS ====================

  async create(createDto: CreateReservationRoomDto, reqBody: any) {
    return this.handleReservationCreation(createDto, reqBody, "offer");
  }

  async createReservationByPackage(createDto: CreateReservationRoomDto, reqBody: any) {
    return this.handleReservationCreation(createDto, reqBody, "package");
  }

  async createReservationByDeal(createDto: CreateReservationRoomDto, reqBody: any) {
    return this.handleReservationCreation(createDto, reqBody, "deal");
  }

  async getReservationsForThisWeek(filterData: any) {
    const queryBuilder = this.reservationRoomRepository.createQueryBuilder("r");
    const weekStartDate = moment(filterData.weekStartDate);
    const startOfWeek = weekStartDate.clone().startOf("week").startOf("day");
    const endOfWeek = weekStartDate.clone().endOf("week").endOf("day");

    const formattedStartOfWeek = startOfWeek.format("DD/MM/YYYY");
    const formattedEndOfWeek = endOfWeek.format("DD/MM/YYYY");

    queryBuilder
      .leftJoinAndSelect("r.room", "rr")
      .where(
        `TO_DATE(r.selected_day, 'DD/MM/YYYY') 
        BETWEEN TO_DATE(:startOfWeek, 'DD/MM/YYYY') 
        AND TO_DATE(:endOfWeek, 'DD/MM/YYYY')`,
        {
          startOfWeek: formattedStartOfWeek,
          endOfWeek: formattedEndOfWeek,
        },
      )
      .leftJoinAndSelect("r.individual", "individual")
      .leftJoinAndSelect("r.company", "company")
      .leftJoinAndSelect("r.studentActivity", "studentActivity").addSelect(`
    COALESCE(individual.name, company.name, studentActivity.name, 'Unknown Client') AS "clientName"
  `);

    if (filterData?.roomIds) {
      queryBuilder.andWhere("rr.id IN (:...roomIds)", {
        roomIds: filterData.roomIds.map(id => String(id)),
      });
    }

    const reservations = await queryBuilder.getRawMany();
    const formattedReservations = reservations.map(reservation => {
      const start = moment(reservation.r_selected_day, "DD/MM/YYYY")
        .set("hour", reservation.r_start_hour)
        .set("minute", reservation.r_start_minute)
        .toDate();

      const end = moment(reservation.r_selected_day, "DD/MM/YYYY")
        .set("hour", reservation.r_end_hour)
        .set("minute", reservation.r_end_minute)
        .toDate();

      return {
        id: String(reservation.r_id),
        title: reservation.clientName,
        start: start.toISOString().replace(/\.\d+Z$/, ""),
        end: end.toISOString().replace(/\.\d+Z$/, ""),
        extendedProps: {
          roomName: reservation.rr_name,
        },
      };
    });

    return {
      data: formattedReservations,
    };
  }

  async findRoomsByUserType(filterData: any, userType: string) {
    const query = this.buildBaseQuery(filterData)
      .leftJoinAndSelect(`e.${userType}`, "user")
      .andWhere(`user.id = :id`, { id: filterData[`${userType}_id`] });
    return this.executePaginatedQuery(query);
  }

  // ==================== finded LOGIC ====================

  async findRoomsByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.room", "er")
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
  async findRoomsByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.room", "er")
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
  async findRoomsByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.room", "er")
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
  async findRoomsByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.room", "er")
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
  async findIndividuaPackageRoomAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.assignesPackages", "em")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .andWhere("em.id = :package_id", { package_id: filterData.package_id })
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
  async findCompanyPackageRoomAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.assignesPackages", "em")
      .andWhere("ei.id = :company_id", { company_id: filterData.company_id })
      .andWhere("em.id = :package_id", { package_id: filterData.package_id })

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
  async findStudentActivityPackageRoomAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.assignesPackages", "em")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .andWhere("em.id = :package_id", { package_id: filterData.package_id })
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
  async findIndividualDealAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.deals", "em")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .andWhere("em.id = :deal_id", { deal_id: filterData.deal_id })
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
  async findCompanyDealAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.deals", "em")
      .andWhere("ei.id = :company_id", { company_id: filterData.company_id })
      .andWhere("em.id = :deal_id", { deal_id: filterData.deal_id })

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
  async findStudentActivityDealAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.deals", "em")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .andWhere("em.id = :deal_id", { deal_id: filterData.deal_id })
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

  async findOne(id: number): Promise<ReservationRoom> {
    const reservation = await this.reservationRoomRepository.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException(`Reservation ${id} not found`);
    return reservation;
  }

  async update(updateDto: UpdateReservationRoomDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      status,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      room_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type_user,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selected_day,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      customer_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      offer_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      deal_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      package_id,
      ...rest
    } = updateDto;

    if (status === ReservationStatus.CANCELLED) {
      await this.handleCancellation(updateDto);
    } else {
      await this.reservationRoomRepository.update(updateDto.id, {
        ...rest,
        status: ReservationStatus.COMPLETE,
      });
    }
    return this.findOne(updateDto.id);
  }

  async remove(id: number) {
    await this.reservationRoomRepository.delete(id);
  }

  // ==================== CORE LOGIC ====================

  private async handleReservationCreation(
    dto: CreateReservationRoomDto,
    reqBody: any,
    type: ReservationType,
  ) {
    const { room_id, selected_day, ...rest } = dto;
    const selectedDay = this.formatDate(selected_day);

    const { startTime, endTime } = this.calculateTimes(rest, selectedDay);
    await this.validateTimeSlot(room_id, selectedDay, startTime, endTime);

    const room = await this.getValidRoom(room_id);
    const additionalData = await this.processAdditionalData(type, dto, reqBody);

    const reservation = this.buildReservationEntity(
      rest,
      room,
      selectedDay,
      additionalData,
      reqBody,
    );
    return this.reservationRoomRepository.save(reservation);
  }

  // ==================== HELPER METHODS ====================

  private formatDate(date: string): string {
    return moment(date).format("DD/MM/YYYY");
  }

  private calculateTimes(details: any, selectedDay: string) {
    return {
      startTime: this.createMoment(
        selectedDay,
        details.start_hour,
        details.start_minute,
        details.start_time,
      ),
      endTime: this.createMoment(
        selectedDay,
        details.end_hour,
        details.end_minute,
        details.end_time,
      ),
    };
  }

  private createMoment(day: string, hour: number, minute: number, period: TimeOfDay) {
    const [d, m, y] = day.split("/");
    const adjustedHour = this.adjustHour(hour, period);
    return moment(`${y}-${m}-${d} ${adjustedHour}:${minute}`, "YYYY-MM-DD HH:mm");
  }

  private adjustHour(hour: number, period: TimeOfDay): number {
    if (period === TimeOfDay.PM && hour !== 12) return hour + 12;
    if (period === TimeOfDay.AM && hour === 12) return 0;
    return hour;
  }

  private async validateTimeSlot(
    roomId: number,
    day: string,
    start: moment.Moment,
    end: moment.Moment,
  ) {
    if (end.isBefore(start)) {
      throw new BadRequestException("End time must be after start time.");
    }

    const startOfDay = moment(day).startOf("day");
    const endOfDay = moment(day).endOf("day");

    if (end.isBefore(startOfDay) || end.isAfter(endOfDay)) {
      throw new BadRequestException("End time must be within the same day.");
    }

    const existing = await this.getActiveReservations(roomId, day);
    if (this.checkOverlap(existing, start, end)) {
      throw new BadRequestException("Time slot overlaps with existing reservation");
    }
  }

  private async getValidRoom(roomId: number) {
    const room = await this.room.findOne(roomId);
    if (!room) throw new BadRequestException("Room not found");
    return room;
  }

  private async processAdditionalData(
    type: ReservationType,
    dto: CreateReservationRoomDto,
    reqBody: any,
  ) {
    switch (type) {
      case "offer":
        return this.processOffer(dto.offer_id, dto.customer_id, dto.type_user, reqBody);
      case "package":
        return this.processPackage(dto.package_id, dto);
      case "deal":
        return this.processDeal(dto.deal_id, dto);
      default:
        return {};
    }
  }

  private buildReservationEntity(
    dto: any,
    room: Room,
    selectedDay: string,
    additionalData: any,
    reqBody: any,
  ) {
    const diffHours = this.calculateHours({
      start_hour: dto.start_hour,
      start_minute: dto.start_minute,
      start_time: dto.start_time,
      end_hour: dto.end_hour,
      end_minute: dto.end_minute,
      end_time: dto.end_time,
    });

    return this.reservationRoomRepository.create({
      ...dto,
      room,
      selected_day: selectedDay,
      total_time: diffHours,
      ...additionalData,
      createdBy: reqBody.createdBy,
      [dto.type_user.toLowerCase()]: reqBody.customer,
    });
  }

  // ==================== QUERY BUILDERS ====================

  private buildBaseQuery(filterData: any) {
    return this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData)
      .leftJoinAndSelect("e.room", "room")
      .leftJoin("e.createdBy", "creator")
      .addSelect(["creator.id", "creator.firstName", "creator.lastName"]);
  }

  private async executePaginatedQuery(query: any) {
    const [data, total] = await Promise.all([query.getMany(), query.getCount()]);
    return { data, recordsFiltered: data.length, totalRecords: total };
  }

  // ==================== SPECIFIC LOGIC HANDLERS ====================

  private async processOffer(
    offerId: number,
    customerId: number,
    typeUser: TypeUser,
    reqBody: any,
  ) {
    if (!offerId) return {};

    const payload: CreateAssignGeneralOfferDto = {
      customer_id: customerId,
      offer_id: offerId,
      type_user: typeUser,
    };

    const assignOffer = await this.assignGlobalOffer.create(payload, reqBody);
    const offer = await this.globalOffer.findOne(offerId);

    return {
      assignGeneralOffer: assignOffer,
      total_price: this.calculatePrice(offer, reqBody.room.price, reqBody),
    };
  }

  // ==================== UPDATED PROCESSING METHODS ====================

  private async processPackage(packageId: number, dto: CreateReservationRoomDto) {
    const packageRoom = await this.validatePackage(packageId);
    this.validatePackageRange(packageRoom, this.formatDate(dto.selected_day));

    // Calculate time difference from DTO
    const diffHours = this.calculateHours({
      start_hour: dto.start_hour,
      start_minute: dto.start_minute,
      start_time: dto.start_time,
      end_hour: dto.end_hour,
      end_minute: dto.end_minute,
      end_time: dto.end_time,
    });

    // Add missing package usage update
    await this.updatePackageUsage(diffHours, packageRoom);

    return { assignesPackages: packageRoom };
  }

  private async processDeal(dealId: number, dto: CreateReservationRoomDto) {
    const deal = await this.validateDeal(dealId);
    this.validateDealRange(deal, this.formatDate(dto.selected_day));

    // Calculate time difference from DTO
    const diffHours = this.calculateHours({
      start_hour: dto.start_hour,
      start_minute: dto.start_minute,
      start_time: dto.start_time,
      end_hour: dto.end_hour,
      end_minute: dto.end_minute,
      end_time: dto.end_time,
    });

    // Add missing deal usage update
    await this.updateDealUsage(diffHours, deal);

    return { deals: deal };
  }

  // ==================== UPDATED USAGE METHODS ====================

  private async updatePackageUsage(diffHours: number, pkg: AssignesPackages) {
    const newUsed = pkg.used + diffHours;
    const newRemaining = pkg.total_used - newUsed;
    if (pkg.total_used < newUsed) {
      throw new BadRequestException(
        `Your package quota is exhausted. Please create a new package.`,
      );
    }

    await this.packageRooms.update({
      id: pkg.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }

  private async updateDealUsage(diffHours: number, deal: Deals) {
    const newUsed = deal.used + diffHours;
    const newRemaining = deal.total_used - newUsed;

    if (deal.total_used < newUsed) {
      throw new BadRequestException(`Your deal quota is exhausted. Please create a new deal.`);
    }

    await this.deal.update({
      id: deal.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }

  // ==================== VALIDATION METHODS ====================

  private async validatePackage(id: number) {
    const pkg = await this.packageRooms.findOne(id);
    if (!pkg) throw new BadRequestException("Invalid package");
    return pkg;
  }

  private async validateDeal(id: number) {
    const deal = await this.deal.findOne(id);
    if (!deal) throw new BadRequestException("Invalid deal");
    return deal;
  }

  private validatePackageRange(pkg: AssignesPackages, selectedDay: string) {
    const date = moment(selectedDay, "DD/MM/YYYY");
    const start = moment(pkg.start_date);
    const end = moment(pkg.end_date);

    if (!start.isSameOrBefore(date) || !end.isSameOrAfter(date)) {
      throw new BadRequestException("Package not active for selected date");
    }
  }

  private validateDealRange(deal: Deals, selectedDay: string) {
    const date = moment(selectedDay, "DD/MM/YYYY");
    const start = moment(deal.start_date);
    const end = moment(deal.end_date);

    if (!start.isSameOrBefore(date) || !end.isSameOrAfter(date)) {
      throw new BadRequestException("Deal not active for selected date");
    }
  }

  // ==================== UTILITY METHODS ====================

  private async getActiveReservations(roomId: number, day: string) {
    return this.reservationRoomRepository
      .createQueryBuilder("reservation")
      .innerJoinAndSelect("reservation.room", "room")
      .where("room.id = :roomId", { roomId })
      .andWhere("reservation.selected_day = :day", { day })
      .andWhere("reservation.status IN (:...statuses)", {
        statuses: [ReservationStatus.ACTIVE, ReservationStatus.COMPLETE],
      })
      .getMany();
  }

  private checkOverlap(
    reservations: ReservationRoom[],
    newStart: moment.Moment,
    newEnd: moment.Moment,
  ) {
    return reservations.some(reservation => {
      const existingStart = this.createMoment(
        reservation.selected_day,
        reservation.start_hour,
        reservation.start_minute,
        reservation.start_time,
      );
      const existingEnd = this.createMoment(
        reservation.selected_day,
        reservation.end_hour,
        reservation.end_minute,
        reservation.end_time,
      );
      return newStart.isSameOrBefore(existingEnd) && newEnd.isSameOrAfter(existingStart);
    });
  }

  private calculatePrice(offer: any, basePrice: number, details: any) {
    const diffHours = this.calculateHours(details);
    let price = diffHours ? basePrice * diffHours : basePrice;
    if (offer?.discount) price = Math.max(0, price - offer.discount);
    return price;
  }

  private calculateHours(details: any) {
    const start = convertTo24HourDate(details.start_hour, details.start_minute, details.start_time);
    const end = convertTo24HourDate(details.end_hour, details.end_minute, details.end_time);
    return Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
  }

  private async handleCancellation(dto: UpdateReservationRoomDto) {
    const { start_hour, start_minute, start_time, end_hour, end_minute, end_time, ...rest } = dto;

    const diffHours = this.calculateHours({
      start_hour,
      start_minute,
      start_time,
      end_hour,
      end_minute,
      end_time,
    });

    if (dto.package_id) {
      const pkg = await this.validatePackage(dto.package_id);
      await this.packageRooms.update({
        id: pkg.id,
        used: pkg.used - diffHours,
        remaining: pkg.remaining + diffHours,
      });
    }

    if (dto.deal_id) {
      const deal = await this.validateDeal(dto.deal_id);
      await this.deal.update({
        id: deal.id,
        used: deal.used - diffHours,
        remaining: deal.remaining + diffHours,
      });
    }

    await this.reservationRoomRepository.update(dto.id, rest);
  }
}
