import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateExpensePlaceChildDto } from "./create-expense-place-child.dto";

export class UpdateExpensePlaceChildDto extends PartialType(CreateExpensePlaceChildDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
