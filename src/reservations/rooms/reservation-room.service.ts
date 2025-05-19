import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { SelectQueryBuilder } from "typeorm";

import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";
import { DepositeService } from "src/deposit/deposites.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { Room } from "src/rooms/room.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { calculateHours, formatDate } from "../helpers/utitlties";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { PriceCalculationMiddleware } from "./middleware/price-calculation.middleware";
import { ReservationStatusMiddleware } from "./middleware/reservation-status.middleware";
import { ReservationCalendarService } from "./reservation-calendar.service";
import { ReservationRoomQueryService } from "./reservation-room-query.service";
import { ReservationRoom } from "./reservation-room.entity";

type ReservationType = "offer" | "package" | "deal" | "normal";

@Injectable()
export class ReservationRoomService
  extends BaseService<ReservationRoom, CreateReservationRoomDto, UpdateReservationRoomDto>
  implements ICrudService<ReservationRoom, CreateReservationRoomDto, UpdateReservationRoomDto>
{
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    private readonly apiFeaturesService: APIFeaturesService,
    private readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly depositeService: DepositeService,
    private readonly room: RoomsService,

    private readonly deal: DealsService,
    private readonly priceCalculationMiddleware: PriceCalculationMiddleware,
    private readonly reservationStatusMiddleware: ReservationStatusMiddleware,
    private readonly queryService: ReservationRoomQueryService,
    private readonly calendarService: ReservationCalendarService,
  ) {
    super(reservationRoomRepository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.createdBy", "ecr")
      .addSelect(["ecr.id", "ecr.firstName", "ecr.lastName"])
      .leftJoin("e.individual", "ep")
      .addSelect(["ep.id", "ep.name", "ep.whatsApp"])
      .leftJoin("e.company", "ec")
      .addSelect(["ec.id", "ec.phone", "ec.name"])
      .leftJoin("e.studentActivity", "es")
      .addSelect(["es.id", "es.name", "es.unviresty"])
      .leftJoinAndSelect("e.deposites", "esdep");

    if (filteredRecord?.search?.value) {
      queryBuilder.andWhere(
        `ep.name LIKE :name OR ec.name LIKE :name OR es.name LIKE :name OR ecr.firstName LIKE :name`,
        {
          name: `%${filteredRecord.search.value}%`,
        },
      );
      queryBuilder.andWhere(`ec.whatsApp LIKE :number OR ep.whatsApp LIKE :number`, {
        number: `%${filteredRecord.search.value}%`,
      });
    }

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }

  // ==================== PUBLIC METHODS ====================

  async create(
    createDto: CreateReservationRoomDto,
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ) {
    return this.handleReservationCreation(
      createDto,
      { createdBy: relations?.createdBy, customer: relations?.customer },
      createDto.offer_id ? "offer" : "normal",
    );
  }

  async createReservationByPackage(createDto: CreateReservationRoomDto, reqBody: any) {
    return this.handleReservationCreation(createDto, reqBody, "package");
  }

  async createReservationByDeal(createDto: CreateReservationRoomDto, reqBody: any) {
    return this.handleReservationCreation(createDto, reqBody, "deal");
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

    await this.reservationRoomRepository.update(updateDto.id, {
      ...rest,
      status: ReservationStatus.COMPLETE,
    });

    return this.findOne(updateDto.id);
  }

  async createDeposite(create: CreateDepositeDto, createdBy: User) {
    const { entity_id } = create;

    try {
      const reservationRoom = await this.findOne(entity_id);

      if (!reservationRoom) {
        throw new NotFoundException(`${reservationRoom} with  not found`);
      }
      const payload: CreateDepositeDto = {
        ...create,
        createdBy,
        reservationRoom,
      };

      const deposite = await this.depositeService.create(payload);

      if (!deposite || deposite.total_price >= reservationRoom.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than assignment total price (${reservationRoom.total_price})`,
        );
      }

      return await this.updateEntity({
        id: entity_id,
        deposites: deposite,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }

  async updateEntity(updateDto: UpdateReservationRoomDto) {
    await this.reservationRoomRepository.update(updateDto.id, updateDto);
    return this.reservationRoomRepository.findOne({
      where: { id: updateDto.id },
      relations: ["deposites"],
    });
  }

  async remove(id: number) {
    await this.reservationRoomRepository.delete(id);
  }

  // ==================== CORE LOGIC ====================

  private async handleReservationCreation(
    dto: CreateReservationRoomDto,
    reqBody: any,
    type: ReservationType,
  ): Promise<ReservationRoom> {
    await this.reservationStatusMiddleware.checkActiveReservations(reqBody);

    const { room_id, selected_day, ...rest } = dto;
    const selectedDay = formatDate(selected_day);

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
        return this.processOffer(dto, reqBody);
      case "package":
        return this.processPackage(dto.package_id, dto);
      case "deal":
        return this.processDeal(dto.deal_id, dto);
      default:
        return this.processCalcNormal(dto);
    }
  }

  private buildReservationEntity(
    dto: any,
    room: Room,
    selectedDay: string,
    additionalData: any,
    reqBody: any,
  ): ReservationRoom {
    const diffHours = calculateHours({
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
      [dto.type_user]: reqBody.customer,
    });
  }

  // ==================== SPECIFIC LOGIC HANDLERS ====================

  private async processOffer(dto: CreateReservationRoomDto, reqBody: any) {
    if (!dto.offer_id) return {};

    const payload: CreateAssignGeneralOfferDto = {
      customer_id: dto.customer_id,
      offer_id: dto.offer_id,
      type_user: dto.type_user,
    };

    const assignOffer = await this.assignGlobalOffer.create(payload, reqBody);
    const priceCalculation = await this.priceCalculationMiddleware.calculatePrice({
      roomId: dto.room_id,
      details: {
        start_hour: dto.start_hour,
        start_minute: dto.start_minute,
        start_time: dto.start_time,
        end_hour: dto.end_hour,
        end_minute: dto.end_minute,
        end_time: dto.end_time,
      },
      offerId: dto.offer_id,
    });

    return {
      assignGeneralOffer: assignOffer,
      total_price: priceCalculation.totalPrice,
    };
  }

  private async processCalcNormal(dto: CreateReservationRoomDto) {
    const priceCalculation = await this.priceCalculationMiddleware.calculatePrice({
      roomId: dto.room_id,
      details: {
        start_hour: dto.start_hour,
        start_minute: dto.start_minute,
        start_time: dto.start_time,
        end_hour: dto.end_hour,
        end_minute: dto.end_minute,
        end_time: dto.end_time,
      },
    });

    return {
      assignGeneralOffer: null,
      total_price: priceCalculation.totalPrice,
    };
  }

  // ==================== UPDATED PROCESSING METHODS ====================

  private async processPackage(packageId: number, dto: CreateReservationRoomDto) {
    const packageRoom = await this.validatePackage(packageId);
    this.validatePackageRange(packageRoom, formatDate(dto.selected_day));

    // Calculate time difference from DTO
    const diffHours = calculateHours({
      start_hour: dto.start_hour,
      start_minute: dto.start_minute,
      start_time: dto.start_time,
      end_hour: dto.end_hour,
      end_minute: dto.end_minute,
      end_time: dto.end_time,
    });

    await this.updatePackageUsage(diffHours, packageRoom);
    return { assignesPackages: packageRoom };
  }

  private async processDeal(dealId: number, dto: CreateReservationRoomDto) {
    const deal = await this.validateDeal(dealId);
    this.validateDealRange(deal, formatDate(dto.selected_day));

    // Calculate time difference from DTO
    const diffHours = calculateHours({
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
}
