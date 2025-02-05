import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
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
  ) {}

  async create(createReservationRoomDto: CreateReservationRoomDto) {
    const reservationRoom = this.reservationRoomRepository.create(createReservationRoomDto);
    return await this.reservationRoomRepository.save(reservationRoom);
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number): Promise<ReservationRoom> {
    const reservationRoom = await this.reservationRoomRepository.findOne({ where: { id } });
    if (!reservationRoom) {
      throw new NotFoundException(`${reservationRoom} with id ${id} not found`);
    }
    return reservationRoom;
  }

  async update(updateReservationRoomDto: UpdateReservationRoomDto) {
    await this.reservationRoomRepository.update(
      updateReservationRoomDto.id,
      updateReservationRoomDto,
    );
    return this.reservationRoomRepository.findOne({ where: { id: updateReservationRoomDto.id } });
  }

  async remove(reservationRoomId: number) {
    await this.reservationRoomRepository.delete(reservationRoomId);
  }
}
