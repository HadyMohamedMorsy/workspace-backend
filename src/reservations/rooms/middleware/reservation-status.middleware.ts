import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { ReservationRoom } from "../reservation-room.entity";

@Injectable()
export class ReservationStatusMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        room_id,
        selected_day,
        start_hour,
        start_minute,
        start_time,
        end_hour,
        end_minute,
        end_time,
      } = req.body;

      const activeReservations = await this.getActiveReservations(room_id, selected_day);

      if (
        this.checkOverlap(activeReservations, {
          start_hour,
          start_minute,
          start_time,
          end_hour,
          end_minute,
          end_time,
        })
      ) {
        throw new BadRequestException("Time slot overlaps with existing reservation");
      }

      const isAvailable = await this.checkRoomAvailability(room_id, selected_day);
      if (!isAvailable) {
        throw new BadRequestException("Room is not available for the selected time");
      }

      req["reservationStatus"] = {
        isAvailable: true,
        hasOverlap: false,
        activeReservations: activeReservations.length,
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  private async getActiveReservations(
    roomId: number,
    selectedDay: string,
  ): Promise<ReservationRoom[]> {
    return this.reservationRoomRepository.find({
      where: {
        room: { id: roomId },
        selected_day: selectedDay,
        status: ReservationStatus.ACTIVE,
      },
    });
  }

  private checkOverlap(
    existingReservations: ReservationRoom[],
    newReservation: {
      start_hour: number;
      start_minute: number;
      start_time: string;
      end_hour: number;
      end_minute: number;
      end_time: string;
    },
  ): boolean {
    const newStart = this.convertToMinutes(
      newReservation.start_hour,
      newReservation.start_minute,
      newReservation.start_time,
    );
    const newEnd = this.convertToMinutes(
      newReservation.end_hour,
      newReservation.end_minute,
      newReservation.end_time,
    );

    return existingReservations.some(reservation => {
      const existingStart = this.convertToMinutes(
        reservation.start_hour,
        reservation.start_minute,
        reservation.start_time,
      );
      const existingEnd = this.convertToMinutes(
        reservation.end_hour,
        reservation.end_minute,
        reservation.end_time,
      );

      const startsInExisting = newStart >= existingStart && newStart < existingEnd;
      const endsInExisting = newEnd > existingStart && newEnd <= existingEnd;
      const containsExisting = newStart <= existingStart && newEnd >= existingEnd;

      return startsInExisting || endsInExisting || containsExisting;
    });
  }

  private convertToMinutes(hour: number, minute: number, period: string): number {
    let totalMinutes = hour * 60 + minute;
    if (period === "PM" && hour !== 12) {
      totalMinutes += 12 * 60;
    }
    if (period === "AM" && hour === 12) {
      totalMinutes -= 12 * 60;
    }
    return totalMinutes;
  }

  private async checkRoomAvailability(roomId: number, selectedDay: string): Promise<boolean> {
    const reservation = await this.reservationRoomRepository.findOne({
      where: {
        room: { id: roomId },
        selected_day: selectedDay,
        status: ReservationStatus.ACTIVE,
      },
    });
    return !!reservation;
  }
}
