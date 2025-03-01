import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsMaxDiscount(
  typeDiscountProperty: string,
  maxValue: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isMaxDiscount",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [typeDiscountProperty, maxValue],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [typeDiscountProperty, maxValue] = args.constraints;
          const typeDiscount = (args.object as any)[typeDiscountProperty];

          if (typeDiscount === "percentage" && value > maxValue) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `For a "percentage" discount type, the discount cannot be greater than ${args.constraints[1]}`;
        },
      },
    });
  };
}
