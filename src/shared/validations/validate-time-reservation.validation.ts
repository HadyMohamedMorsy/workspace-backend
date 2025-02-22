import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import * as moment from "moment";

export function IsAfter(startDateProperty: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isAfter",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [startDateProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [startDateProperty] = args.constraints;
          const startDateValue = (args.object as any)[startDateProperty];

          const endDate = moment.utc(value);
          const startDate = moment.utc(startDateValue);

          if (!endDate.isValid() || !startDate.isValid()) {
            return false;
          }

          return endDate.isAfter(startDate);
        },
        defaultMessage(args: ValidationArguments) {
          return `"${args.property}" must be after "${args.constraints[0]}"`;
        },
      },
    });
  };
}
