import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @Type(() => Number)
  revenueChild_id: number;
}
