import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as moment from "moment";

@ValidatorConstraint({ name: "IsStartBeforeEnd", async: false })
export class IsStartBeforeEndValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { selected_day, start_hour, start_minute, start_time, end_hour, end_minute, end_time } =
      args.object as any;

    const startMoment = moment(
      `${selected_day} ${start_hour}:${start_minute} ${start_time}`,
      "YYYY-MM-DD h:m a",
    );

    const endMoment = moment(
      `${selected_day} ${end_hour}:${end_minute} ${end_time}`,
      "YYYY-MM-DD h:m a",
    );

    const isStartBeforeEnd = startMoment.isBefore(endMoment);
    const isSameDay = startMoment.isSame(endMoment, "day");

    return isStartBeforeEnd && isSameDay;
  }

  defaultMessage(): string {
    return "Start time must be before end time, and the selected day must be today.";
  }
}
