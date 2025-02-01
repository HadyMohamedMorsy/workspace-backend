import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { TimeOfDay } from "../enum/global-enum";

@ValidatorConstraint({ name: "IsStartBeforeEnd", async: false })
export class IsStartBeforeEndValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { startHour, startMinute, startTime, endHour, endMinute, endTime } = args.object as any;

    const convertTo24HourFormat = (hour: string, minute: string, period: TimeOfDay) => {
      const hourInt = parseInt(hour);
      const adjustedHour = period === TimeOfDay.PM && hourInt < 12 ? hourInt + 12 : hourInt;
      return adjustedHour * 60 + parseInt(minute);
    };

    const startTotalMinutes = convertTo24HourFormat(startHour, startMinute, startTime);
    const endTotalMinutes = convertTo24HourFormat(endHour, endMinute, endTime);

    return startTotalMinutes < endTotalMinutes && startTime === endTime;
  }

  defaultMessage(): string {
    return "Start time must be before end time, and both should have the same AM/PM period.";
  }
}
