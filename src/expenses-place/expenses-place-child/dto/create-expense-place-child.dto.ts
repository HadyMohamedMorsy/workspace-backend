import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateExpensePlaceChildDto {
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @Type(() => Number)
  expensePlace_id: number;
}
