import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isBefore, parseISO } from "date-fns";

@ValidatorConstraint({ name: "IsDateBefore", async: false })
export class IsDateBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    const date1 = parseISO(value);
    const date2 = parseISO(relatedValue);
    return isBefore(date1, date2);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be before ${relatedPropertyName}`;
  }
}

export function IsDateBefore(property: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsDateBeforeConstraint,
    });
  };
}
