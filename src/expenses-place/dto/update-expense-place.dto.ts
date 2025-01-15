import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateExpensePlaceDto } from "./create-expense-place.dto";

export class UpdateExpensePlaceDto extends PartialType(CreateExpensePlaceDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
