import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateExpenseSalariesDto } from "./create-expense-salaries.dto";

export class UpdateExpenseSalariesDto extends PartialType(CreateExpenseSalariesDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
