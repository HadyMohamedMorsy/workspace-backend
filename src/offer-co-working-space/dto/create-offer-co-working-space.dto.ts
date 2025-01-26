import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export enum DiscountType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

export class CreateCoWorkingSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  days: number;
}
