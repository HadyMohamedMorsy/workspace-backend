import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @Type(() => Number)
  revenueChild_id: number;
}
