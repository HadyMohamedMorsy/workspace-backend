import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsAfter } from "src/shared/validations/validate-time-reservation.validation";
import { PRODUCT_TYPE } from "../enum/product.enum";
import { IsMaxDiscount } from "./custom/ismax-discount";

export enum DiscountType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

export class CreateGeneralOfferDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PRODUCT_TYPE, {
    message: "produce must be one of the following: shared, deskarea, Room",
  })
  product: PRODUCT_TYPE;

  @IsString()
  @IsNotEmpty()
  start_date;

  @IsString()
  @IsNotEmpty()
  @IsAfter("start_date")
  end_date: string;

  @IsEnum(DiscountType, { message: 'discount_type must be either "percentage" or "amount"' })
  type_discount: DiscountType;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @IsMaxDiscount("type_discount", 100, {
    message: 'If discount type is "percentage", discount must not exceed 100',
  })
  discount: number;
}
