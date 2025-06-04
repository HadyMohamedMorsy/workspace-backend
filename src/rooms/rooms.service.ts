import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository } from "typeorm";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Room } from "./room.entity";

@Injectable()
export class RoomsService
  extends BaseService<Room, CreateRoomDto, UpdateRoomDto>
  implements ICrudService<Room, CreateRoomDto, UpdateRoomDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(Room)
    repository: Repository<Room>,
  ) {
    super(repository, apiFeaturesService);
  }

  async findUserAll(filterData) {
    const queryBuilder = this.apiService.setRepository(Room).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "ec")
      .leftJoin("e.createdBy", "eu")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }
}
