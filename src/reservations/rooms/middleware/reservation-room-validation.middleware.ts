import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import * as moment from "moment-timezone";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { ReservationRoom } from "../reservation-room.entity";

@Injectable()
export class ReservationRoomValidationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ReservationRoom)
    private readonly reservationRoomRepository: Repository<ReservationRoom>,
    private readonly packageRooms: AssignesPackagesService,
    private readonly deal: DealsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    // Validate time slot
    await this.validateTimeSlot(body);

    // Validate package or deal if provided
    if (body.package_id) {
      await this.validatePackage(body.package_id, body.selected_day);
    }
    if (body.deal_id) {
      await this.validateDeal(body.deal_id, body.selected_day);
    }

    next();
  }

  private async validateTimeSlot(body: any) {
    const startTime = this.createMoment(
      body.selected_day,
      body.start_hour,
      body.start_minute,
      body.start_time,
    );
    const endTime = this.createMoment(
      body.selected_day,
      body.end_hour,
      body.end_minute,
      body.end_time,
    );

    if (endTime.isBefore(startTime)) {
      throw new BadRequestException("End time must be after start time.");
    }

    const parsedDay = moment(body.selected_day, "DD/MM/YYYY");
    const startOfDay = parsedDay.clone().startOf("day");
    const endOfDay = parsedDay.clone().endOf("day");

    if (endTime.isBefore(startOfDay) || endTime.isAfter(endOfDay)) {
      throw new BadRequestException("End time must be within the same day.");
    }

    const existing = await this.getActiveReservations(body.room_id, body.selected_day);
    if (this.checkOverlap(existing, startTime, endTime)) {
      throw new BadRequestException("Time slot overlaps with existing reservation");
    }
  }

  private async validatePackage(id: number, selectedDay: string) {
    const pkg = await this.packageRooms.findOne(id);
    if (!pkg) {
      throw new BadRequestException("Invalid package");
    }

    this.validatePackageRange(pkg, selectedDay);
  }

  private async validateDeal(id: number, selectedDay: string) {
    const deal = await this.deal.findOne(id);
    if (!deal) {
      throw new BadRequestException("Invalid deal");
    }

    this.validateDealRange(deal, selectedDay);
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
}
