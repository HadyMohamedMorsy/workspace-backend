import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateExpenseSalariesDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;
}
