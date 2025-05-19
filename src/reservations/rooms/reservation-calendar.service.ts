import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment-timezone";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { ato24h, createCairoTime } from "../helpers/utitlties";
import { ReservationRoom } from "./reservation-room.entity";

@Injectable()
export class ReservationCalendarService {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
  ) {}

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
      AND TO_DATE(:endOfWeek, 'DD/MM/YYYY')
      AND r.status != :status`,
        {
          startOfWeek: formattedStartOfWeek,
          endOfWeek: formattedEndOfWeek,
          status: ReservationStatus.CANCELLED,
        },
      )
      .leftJoinAndSelect("r.individual", "individual")
      .leftJoinAndSelect("r.company", "company")
      .leftJoinAndSelect("r.studentActivity", "studentActivity")
      .addSelect(
        `
    COALESCE(individual.name, company.name, studentActivity.name, 'Unknown Client') AS "clientName"
  `,
      );

    if (filterData?.roomIds && filterData.roomIds.length > 0) {
      queryBuilder.andWhere("rr.id IN (:...roomIds)", {
        roomIds: filterData.roomIds.map(id => String(id)),
      });
    }

    const reservations = await queryBuilder.getRawMany();

    if (filterData?.isFree) {
      const freeSlots = this.getFreeSlots(reservations, filterData.roomIds, startOfWeek, endOfWeek);
      return { data: freeSlots };
    }

    const formattedReservations = reservations.map(res => this.formatReservation(res));
    return {
      data: formattedReservations,
    };
  }

  private formatReservation(res: any) {
    const timeZone = "Africa/Cairo";
    const startHour = ato24h(res.r_start_hour, res.r_start_time);
    const endHour = ato24h(res.r_end_hour, res.r_end_time);
    const start = createCairoTime(res.r_selected_day, startHour, res.r_start_minute, timeZone);
    const end = createCairoTime(res.r_selected_day, endHour, res.r_end_minute, timeZone);

    return {
      id: String(res.r_id),
      title: res.clientName || "Unknown Client",
      start: start.format("YYYY-MM-DDTHH:mm:ssZ"),
      end: end.format("YYYY-MM-DDTHH:mm:ssZ"),
      extendedProps: {
        roomName: res.rr_name,
      },
    };
  }

  private getFreeSlots(
    reservations: any[],
    roomIds: string[],
    startOfWeek: moment.Moment,
    endOfWeek: moment.Moment,
  ) {
    const timeZone = "Africa/Cairo";
    const freeSlots = [];

    const rooms = roomIds || [...new Set(reservations.map(res => res.rr_id))];

    rooms.forEach(roomId => {
      const roomReservations = reservations
        .filter(res => res.rr_id === roomId)
        .map(res => ({
          ...res,
          start: createCairoTime(
            res.r_selected_day,
            ato24h(res.r_start_hour, res.r_start_time),
            res.r_start_minute,
            timeZone,
          ),
          end: createCairoTime(
            res.r_selected_day,
            ato24h(res.r_end_hour, res.r_end_time),
            res.r_end_minute,
            timeZone,
          ),
        }));

      // Sort by start time
      roomReservations.sort((a, b) => a.start.valueOf() - b.start.valueOf());

      let lastEnd = startOfWeek.clone().tz(timeZone);
      const roomName = roomReservations[0]?.rr_name || "Unknown Room";

      // Check gaps between reservations
      for (const res of roomReservations) {
        if (res.start.isAfter(lastEnd)) {
          freeSlots.push({
            roomId,
            roomName,
            start: lastEnd.format("YYYY-MM-DDTHH:mm:ssZ"),
            end: res.start.format("YYYY-MM-DDTHH:mm:ssZ"),
          });
        }

        if (res.end.isAfter(lastEnd)) {
          lastEnd = res.end.clone();
        }
      }

      if (lastEnd.isBefore(endOfWeek)) {
        freeSlots.push({
          roomId,
          roomName,
          start: lastEnd.format("YYYY-MM-DDTHH:mm:ssZ"),
          end: endOfWeek.format("YYYY-MM-DDTHH:mm:ssZ"),
        });
      }
    });

    return freeSlots;
  }
}
