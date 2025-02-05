import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./room.entity";

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createRoomsDto: CreateRoomDto): Promise<Room> {
    const rooms = this.roomsRepository.create(createRoomsDto);
    return await this.roomsRepository.save(rooms);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Room).buildQuery(filterData);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  public async findList() {
    const rooms = await this.roomsRepository.find({});
    return {
      data: rooms,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Room> {
    return this.roomsRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateRoomsDto: UpdateRoomDto) {
    await this.roomsRepository.update(updateRoomsDto.id, updateRoomsDto);
    return this.roomsRepository.findOne({ where: { id: updateRoomsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.roomsRepository.delete(id);
  }
}
