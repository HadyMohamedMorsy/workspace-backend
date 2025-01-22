import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateExpensePlaceChildDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @Type(() => Number)
  expensePlace_id: number;
}
