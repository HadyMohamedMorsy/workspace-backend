import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import * as moment from "moment-timezone";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";
import { createMoment } from "src/reservations/helpers/utitlties";
import { ReservationStatus } from "src/shared/enum/global-enum";
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

    await this.validateTimeSlot(body, req["selected_day"]);

    if (body.package_id) {
      const pkg = await this.validatePackage(body.package_id, req["selected_day"]);
      req["pkg"] = pkg;
    }

    if (body.deal_id) {
      const deal = await this.validateDeal(body.deal_id, req["selected_day"]);
      req["deal"] = deal;
    }

    next();
  }

  private async validateTimeSlot(body: any, selectedDay: string) {
    const startTime = createMoment(
      selectedDay,
      body.start_hour,
      body.start_minute,
      body.start_time,
    );
    const endTime = createMoment(selectedDay, body.end_hour, body.end_minute, body.end_time);

    if (endTime.isBefore(startTime)) {
      throw new BadRequestException("End time must be after start time.");
    }

    const parsedDay = moment(selectedDay, "DD/MM/YYYY");
    const startOfDay = parsedDay.clone().startOf("day");
    const endOfDay = parsedDay.clone().endOf("day");

    if (endTime.isBefore(startOfDay) || endTime.isAfter(endOfDay)) {
      throw new BadRequestException("End time must be within the same day.");
    }

    const existing = await this.getActiveReservations(body.room_id, selectedDay);
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
        statuses: [ReservationStatus.ACTIVE, ReservationStatus.PENDING],
      })
      .getMany();
  }

  private checkOverlap(
    reservations: ReservationRoom[],
    newStart: moment.Moment,
    newEnd: moment.Moment,
  ) {
    return reservations.some(reservation => {
      const existingStart = createMoment(
        reservation.selected_day,
        reservation.start_hour,
        reservation.start_minute,
        reservation.start_time,
      );
      const existingEnd = createMoment(
        reservation.selected_day,
        reservation.end_hour,
        reservation.end_minute,
        reservation.end_time,
      );
      return newStart.isSameOrBefore(existingEnd) && newEnd.isSameOrAfter(existingStart);
    });
  }
}
