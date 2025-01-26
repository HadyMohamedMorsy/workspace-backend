import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export enum DiscountType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

export class CreateOfferPackagesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  hours: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  room_id: number;
}
