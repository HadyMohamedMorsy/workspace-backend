import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { SelectQueryBuilder } from "typeorm";

import { DepositeService } from "src/deposit/deposites.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoom } from "./reservation-room.entity";

@Injectable()
export class ReservationRoomService
  extends BaseService<ReservationRoom, CreateReservationRoomDto, UpdateReservationRoomDto>
  implements ICrudService<ReservationRoom, CreateReservationRoomDto, UpdateReservationRoomDto>
{
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    private readonly apiFeaturesService: APIFeaturesService,
    protected readonly depositeService: DepositeService,
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

  async createReservationByPackage(
    createDto: CreateReservationRoomDto,
    reqBody: any,
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ) {
    const reservation = await this.handleReservationCreation(createDto, reqBody, "package");
    return this.findOne(reservation.id, selectOptions, relations);
  }

  async createReservationByDeal(
    createDto: CreateReservationRoomDto,
    reqBody: any,
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ) {
    const reservation = await this.handleReservationCreation(createDto, reqBody, "deal");
    return this.findOne(reservation.id, selectOptions, relations);
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
}
