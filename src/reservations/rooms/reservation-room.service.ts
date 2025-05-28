import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { SelectQueryBuilder } from "typeorm";

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
  ) {
    super(reservationRoomRepository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.individual", "ep")
      .addSelect(["ep.id", "ep.name", "ep.whatsApp"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.phone", "eco.name"])
      .leftJoin("e.studentActivity", "es")
      .addSelect(["es.id", "es.name", "es.unviresty"])
      .leftJoin("e.deposites", "esdep")
      .addSelect(["esdep.id"]);

    if (filteredRecord?.search?.value) {
      queryBuilder.andWhere(`ep.name LIKE :name OR ec.name LIKE :name OR es.name LIKE :name`, {
        name: `%${filteredRecord.search.value}%`,
      });
    }

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord.customFilters.start_date,
        end_date: filteredRecord.customFilters.end_date,
      });
    }
  }
}
