import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as moment from "moment";
import { CreateReservationRoomDto } from "src/reservations/rooms/dto/create-reservation-rooms.dto";
import { TimeOfDay } from "../enum/global-enum";

@ValidatorConstraint({ async: false })
export class ValidateTimeReservationValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as CreateReservationRoomDto;
    const { selected_day, start_hour, start_minute, start_time, end_hour, end_minute, end_time } =
      object;

    // Convert selected_day and time components into moment objects
    const startDateTime = this.createMomentFromTimeComponents(
      selected_day,
      start_hour,
      start_minute,
      start_time,
    );
    const endDateTime = this.createMomentFromTimeComponents(
      selected_day,
      end_hour,
      end_minute,
      end_time,
    );

    const now = moment();
    return (
      startDateTime.isAfter(now) && endDateTime.isAfter(now) && startDateTime.isBefore(endDateTime)
    );
  }

  private createMomentFromTimeComponents(
    day: string,
    hour: number,
    minute: number,
    timeOfDay: TimeOfDay,
  ): moment.Moment {
    const [dayOfMonth, month, year] = day.split("/");
    let adjustedHour = hour;
    if (timeOfDay === TimeOfDay.PM && hour !== 12) adjustedHour += 12;
    if (timeOfDay === TimeOfDay.AM && hour === 12) adjustedHour = 0;
    return moment(`${year}-${month}-${dayOfMonth} ${adjustedHour}:${minute}`, "YYYY-MM-DD HH:mm");
  }

  defaultMessage() {
    return "The reservation start and end time must be in the future and valid.";
  }
}
