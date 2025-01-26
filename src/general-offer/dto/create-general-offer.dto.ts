import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import * as moment from "moment";
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
  start_date = moment().utc().startOf("day").toDate();

  @IsString()
  @IsNotEmpty()
  end_date = moment().utc().endOf("day").toDate();

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
