import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as moment from "moment";

@ValidatorConstraint({ name: "isNotPastTimeGroup", async: false })
export class IsNotPastTimeGroupValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;

    const startHour = object.start_hour;
    const startMinute = object.start_minute;
    const startTime = object.start_time;

    if (startHour == null || startMinute == null || startTime == null) {
      return true;
    }

    const currentDate = moment();

    let inputDate: moment.Moment;

    // Adjust input time based on AM/PM
    if (startTime === "pm" && startHour < 12) {
      inputDate = moment().set({
        hour: startHour + 12,
        minute: startMinute,
        second: 0,
        millisecond: 0,
      });
    } else if (startTime === "am" && startHour === 12) {
      inputDate = moment().set({
        hour: 0,
        minute: startMinute,
        second: 0,
        millisecond: 0,
      });
    } else {
      inputDate = moment().set({
        hour: startHour,
        minute: startMinute,
        second: 0,
        millisecond: 0,
      });
    }

    // Compare input time with current time
    return inputDate.isSameOrAfter(currentDate);
  }

  defaultMessage() {
    return "The time (start_hour, start_minute, and start_time) must not be in the past.";
  }
}
