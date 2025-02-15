import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { Individual } from "src/individual/individual.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoom } from "./reservation-room.entity";

@Injectable()
export class ReservationRoomService {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly globalOffer: GeneralOfferService,
    protected readonly room: RoomsService,
    protected readonly packageRooms: AssignesPackagesService,
    protected readonly deal: DealsService,
  ) {}

  async create(
    createReservationRoomDto: CreateReservationRoomDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const {
      room_id,
      type_user,
      selected_day,
      start_hour,
      start_minute,
      start_time,
      end_hour,
      end_minute,
      customer_id,
      offer_id,
      end_time,
    } = createReservationRoomDto;

    const startTime = this.getTime(selected_day, start_hour, start_minute, start_time);
    const endTime = this.getTime(selected_day, end_hour, end_minute, end_time);

    const isOverlap = await this.findActiveReservationsForRoom(
      room_id,
      selected_day,
      startTime,
      endTime,
    );

    if (isOverlap) {
      throw new BadRequestException(
        "The selected time slot overlaps with an existing reservation.",
      );
    }

    let assignGeneralOffer = null;
    let globalOffer = null;

    if (offer_id) {
      const payload = {
        customer_id,
        offer_id,
        type_user,
      } as CreateAssignGeneralOfferDto;

      assignGeneralOffer = await this.assignGlobalOffer.create(payload, reqBody);
      globalOffer = await this.globalOffer.findOne(offer_id);
    }

    const room = await this.room.findOne(room_id);

    if (!room) {
      throw new BadRequestException("there is no room finded.");
    }

    const startDate = this.convertTo24HourDate(start_hour, start_minute, start_time);
    const endDate = this.convertTo24HourDate(end_hour, end_minute, end_time);
    const diffInHours = this.calculateTimeDifferenceInHours(startDate, endDate);

    let totalPrice = diffInHours ? room.price * +diffInHours : room.price;

    if (globalOffer && globalOffer.discount) {
      totalPrice -= globalOffer.discount;
      if (totalPrice < 0) totalPrice = 0;
    }

    const reservationRoom = this.reservationRoomRepository.create({
      ...createReservationRoomDto,
      assignGeneralOffer,
      room,
      total_price: totalPrice,
      total_time: diffInHours,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.reservationRoomRepository.save(reservationRoom);
  }
  async createReservationByPackage(
    createReservationRoomDto: CreateReservationRoomDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const {
      room_id,
      type_user,
      selected_day,
      package_id,
      start_hour,
      start_minute,
      start_time,
      end_hour,
      end_minute,
      end_time,
    } = createReservationRoomDto;

    const startTime = this.getTime(selected_day, start_hour, start_minute, start_time);
    const endTime = this.getTime(selected_day, end_hour, end_minute, end_time);

    const isOverlap = await this.findActiveReservationsForRoom(
      room_id,
      selected_day,
      startTime,
      endTime,
    );

    if (isOverlap) {
      throw new BadRequestException(
        "The selected time slot overlaps with an existing reservation.",
      );
    }

    const startDate = this.convertTo24HourDate(start_hour, start_minute, start_time);
    const endDate = this.convertTo24HourDate(end_hour, end_minute, end_time);
    const diffInHours = this.calculateTimeDifferenceInHours(startDate, endDate);

    const packageRoom = await this.validatePackage(package_id);
    this.validatePackageRoomUsage(packageRoom);
    this.validatePackageRoomRange(packageRoom);
    await this.updatePackageUsage(diffInHours, packageRoom);

    const room = await this.room.findOne(room_id);

    if (!room) {
      throw new BadRequestException("there is no room finded.");
    }

    const reservationRoom = this.reservationRoomRepository.create({
      ...createReservationRoomDto,
      room,
      assignesPackages: packageRoom,
      total_time: diffInHours,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.reservationRoomRepository.save(reservationRoom);
  }
  async createReservationByDeal(
    createReservationRoomDto: CreateReservationRoomDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const {
      room_id,
      type_user,
      selected_day,
      deal_id,
      start_hour,
      start_minute,
      start_time,
      end_hour,
      end_minute,
      end_time,
    } = createReservationRoomDto;

    const startTime = this.getTime(selected_day, start_hour, start_minute, start_time);
    const endTime = this.getTime(selected_day, end_hour, end_minute, end_time);

    const isOverlap = await this.findActiveReservationsForRoom(
      room_id,
      selected_day,
      startTime,
      endTime,
    );

    if (isOverlap) {
      throw new BadRequestException(
        "The selected time slot overlaps with an existing reservation.",
      );
    }

    const startDate = this.convertTo24HourDate(start_hour, start_minute, start_time);
    const endDate = this.convertTo24HourDate(end_hour, end_minute, end_time);
    const diffInHours = this.calculateTimeDifferenceInHours(startDate, endDate);

    const deal = await this.validateDeal(deal_id);
    this.validateDealUsage(deal);
    this.validateDealRange(deal);
    await this.updateDealUsage(diffInHours, deal);

    const room = await this.room.findOne(room_id);

    if (!room) {
      throw new BadRequestException("there is no room finded.");
    }

    const reservationRoom = this.reservationRoomRepository.create({
      ...createReservationRoomDto,
      room,
      deals: deal,
      total_time: diffInHours,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.reservationRoomRepository.save(reservationRoom);
  }
  async findActiveReservationsForRoom(
    roomId: number,
    selectedDay: string,
    startTime: moment.Moment,
    endTime: moment.Moment,
  ) {
    const existingReservations = await this.getActiveReservationsForRoomAndDay(roomId, selectedDay);
    return this.hasOverlappingReservation(existingReservations, startTime, endTime);
  }
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

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

  async findOne(id: number): Promise<ReservationRoom> {
    const reservationRoom = await this.reservationRoomRepository.findOne({ where: { id } });
    if (!reservationRoom) {
      throw new NotFoundException(`${reservationRoom} with id ${id} not found`);
    }
    return reservationRoom;
  }

  async update(updateReservationRoomDto: UpdateReservationRoomDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { customer_id, deal_id, package_id, type_user, ...rest } = updateReservationRoomDto;

    if (updateReservationRoomDto.status === ReservationStatus.CANCELLED) {
      await this.handleCancelledStatus(updateReservationRoomDto, package_id, deal_id, rest);
    } else {
      await this.handleCompletedStatus(updateReservationRoomDto, rest);
    }

    return this.reservationRoomRepository.findOne({ where: { id: updateReservationRoomDto.id } });
  }

  async remove(reservationRoomId: number) {
    await this.reservationRoomRepository.delete(reservationRoomId);
  }

  private getTime(day: string, hour: number, minute: number, timeOfDay: TimeOfDay) {
    const [dayOfMonth, month, year] = day.split("/");
    const adjustedHour = this.startTimeOfDay(hour, timeOfDay);
    const formattedDate = `${year}-${month}-${dayOfMonth} ${adjustedHour}:${minute}`;
    return moment(formattedDate, "YYYY-MM-DD HH:mm");
  }

  private startTimeOfDay(hour: number, timeOfDay: TimeOfDay): number {
    if (timeOfDay === TimeOfDay.PM && hour !== 12) {
      return hour + 12;
    }
    if (timeOfDay === TimeOfDay.AM && hour === 12) {
      return 0;
    }
    return hour;
  }

  private async getActiveReservationsForRoomAndDay(roomId: number, selectedDay: string) {
    return this.reservationRoomRepository
      .createQueryBuilder("reservation")
      .innerJoinAndSelect("reservation.room", "room")
      .where("room.id = :roomId", { roomId })
      .andWhere("reservation.selected_day = :selectedDay", { selectedDay })
      .andWhere("reservation.status = :status", { status: ReservationStatus.ACTIVE })
      .getMany();
  }

  private hasOverlappingReservation(
    reservations: ReservationRoom[],
    newStartTime: moment.Moment,
    newEndTime: moment.Moment,
  ) {
    return reservations.some(reservation => {
      const existingStartTime = this.getTime(
        reservation.selected_day,
        reservation.start_hour,
        reservation.start_minute,
        reservation.start_time,
      );
      const existingEndTime = this.getTime(
        reservation.selected_day,
        reservation.end_hour,
        reservation.end_minute,
        reservation.end_time,
      );

      return newStartTime.isBefore(existingEndTime) && newEndTime.isAfter(existingStartTime);
    });
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

  private async updatePackageUsage(
    difHours: number,
    packageRoom: AssignesPackages,
    operator = "plus",
  ) {
    const newUsed = operator === "plus" ? packageRoom.used + difHours : packageRoom.used - difHours;
    const newRemaining =
      operator === "plus" ? packageRoom.total_used - newUsed : packageRoom.remaining;

    await this.packageRooms.update({
      id: packageRoom.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }
  private async updateDealUsage(difHours: number, deal: Deals, operator = "plus") {
    const newUsed = operator === "plus" ? deal.used + difHours : deal.used - difHours;
    const newRemaining = operator === "plus" ? deal.total_used - newUsed : deal.remaining;

    await this.deal.update({
      id: deal.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }

  private async validatePackage(packageId: number) {
    const packageRooms = await this.packageRooms.findOne(packageId);
    if (!packageRooms) {
      throw new BadRequestException(`You must have a valid packageRooms.`);
    }
    return packageRooms;
  }

  private async validateDeal(dealId: number) {
    const deal = await this.deal.findOne(dealId);
    if (!deal) {
      throw new BadRequestException(`You must have a valid deal.`);
    }
    return deal;
  }

  private validatePackageRoomRange(packageRoom: AssignesPackages) {
    const currentDate = moment();
    const startDate = moment(packageRoom.start_date);
    const endDate = moment(packageRoom.end_date);

    if (!startDate.isBefore(currentDate) || !endDate.isAfter(currentDate)) {
      throw new BadRequestException(`The packageRoom is not active for the current date.`);
    }
  }

  private validateDealRange(deal: Deals) {
    const currentDate = moment();
    const startDate = moment(deal.start_date);
    const endDate = moment(deal.end_date);

    if (!startDate.isBefore(currentDate) || !endDate.isAfter(currentDate)) {
      throw new BadRequestException(`The deal is not active for the current date.`);
    }
  }

  private validatePackageRoomUsage(packageRoom: AssignesPackages) {
    if (packageRoom.used == packageRoom.total_used) {
      throw new BadRequestException(
        `Your membership quota is exhausted. Please create a new packageRoom.`,
      );
    }
  }

  private validateDealUsage(deal: Deals) {
    if (deal.used == deal.total_used) {
      throw new BadRequestException(
        `Your membership quota is exhausted. Please create a new deal.`,
      );
    }
  }

  private async handleCancelledStatus(
    updateReservationRoomDto: UpdateReservationRoomDto,
    packageId: number | undefined,
    dealId: number | undefined,
    rest: Partial<UpdateReservationRoomDto>,
  ) {
    const { start_hour, start_minute, start_time, end_hour, end_minute, end_time } =
      updateReservationRoomDto;

    const startDate = this.convertTo24HourDate(start_hour, start_minute, start_time);
    const endDate = this.convertTo24HourDate(end_hour, end_minute, end_time);
    const diffInHours = this.calculateTimeDifferenceInHours(startDate, endDate);

    if (packageId) {
      const packageRoom = await this.validatePackage(packageId);
      await this.updatePackageUsage(diffInHours, packageRoom, "minus");
    }
    if (dealId) {
      const deal = await this.validateDeal(dealId);
      await this.updateDealUsage(diffInHours, deal, "minus");
    }
    await this.reservationRoomRepository.update(updateReservationRoomDto.id, rest);
  }

  private async handleCompletedStatus(
    updateReservationRoomDto: UpdateReservationRoomDto,
    rest: Partial<UpdateReservationRoomDto>,
  ) {
    await this.reservationRoomRepository.update(updateReservationRoomDto.id, {
      ...rest,
      status: ReservationStatus.COMPLETE,
    });
  }
}
